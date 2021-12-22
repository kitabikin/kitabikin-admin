import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { DataBase } from './data-base';
import { GroupData } from './data-input';

// PACKAGE
import { assign, map, filter, find } from 'lodash';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DataService {
  constructor(private fb: FormBuilder) {}

  formatValue(controlType: string, value: any) {
    let newValue;
    switch (controlType) {
      case 'datepicker':
        const dp = new Date(value);
        newValue = new NgbDate(dp.getFullYear(), dp.getMonth() + 1, dp.getDate());
        break;
      case 'timepicker':
        const tp = value.split(':');
        newValue = {
          hour: parseInt(tp[0], 10),
          minute: parseInt(tp[1], 10),
          second: parseInt(tp[2], 10),
        };
        break;
      default:
        newValue = value;
        break;
    }

    return newValue;
  }

  toForm(datas: DataBase<string>[]) {
    const group: any = [];

    map(datas, (feature) => {
      const invitationFeature = {
        id_invitation_feature: feature.id,
        is_active: feature.value,
      };

      const invitationFeatureDatas: any[] = [];
      map(feature.sub, (data) => {
        const invitationFeatureData = {
          id_invitation_feature_data: data.id,
          value: this.formatValue(data.controlType, data.value),
          is_active: data.is_active,
        };

        if (data.sub) {
          const dynamic: any[] = [];
          map(data.sub, (subData) => {
            const dynamicData = {};

            map(subData, (item: any) => {
              assign(dynamicData, { id_invitation_feature_data: item.id });
              assign(dynamicData, { [item.key]: this.formatValue(item.controlType, item.value) });
            });

            dynamic.push(this.fb.group(dynamicData));
          });

          assign(invitationFeatureData, {
            dynamic: this.fb.array(dynamic),
          });
        }

        invitationFeatureDatas.push(this.fb.group(invitationFeatureData));

        assign(invitationFeature, {
          invitation_feature_data: this.fb.array(invitationFeatureDatas),
        });
      });

      group.push(this.fb.group(invitationFeature));
    });

    const formGroup = this.fb.group({
      invitation_feature: this.fb.array(group),
    });

    return formGroup;
  }

  getDatas(datas: any) {
    const forms: DataBase<string>[] = [];

    map(datas, (data) => {
      const invitationFeature = {
        id: data.id_invitation_feature,
        key: 'is_active',
        label: data.theme_feature.name,
        value: data.is_active,
        order: data.theme_feature.order,
      };

      const themeFeatures = data.theme_feature.theme_feature_column;
      const invitationFeatureDatas = data.invitation_feature_data;

      if (themeFeatures.length > 0) {
        const invitationFeatureData: any[] = [];

        map(themeFeatures, (themeFeature) => {
          const search = filter(invitationFeatureDatas, {
            id_theme_feature_column: themeFeature.id_theme_feature_column,
          });

          if (themeFeature.configuration.form === 'normal') {
            invitationFeatureData.push({
              formType: themeFeature.configuration.form,
              controlType: themeFeature.configuration.type,
              id: search[0].id_invitation_feature_data,
              key: 'value',
              label: themeFeature.label,
              value: search[0].value,
              is_active: search[0].is_active,
            });
          } else {
            const sub: any[] = [];

            map(JSON.parse(search[0].value), (searchData) => {
              const subDynamic: any[] = [];
              map(Object.keys(searchData), (key) => {
                const searchDynamic = find(themeFeature.configuration.field, {
                  code: key,
                });

                subDynamic.push({
                  formType: 'normal',
                  controlType: searchDynamic.type,
                  id: search[0].id_invitation_feature_data,
                  key: key,
                  value: searchData[key],
                });
              });

              sub.push(subDynamic);
            });

            invitationFeatureData.push({
              formType: themeFeature.configuration.form,
              controlType: 'group',
              label: themeFeature.label,
              id: search[0].id_invitation_feature_data,
              is_active: search[0].is_active,
              sub,
            });
          }
        });

        assign(invitationFeature, { sub: invitationFeatureData });
      }

      const form: DataBase<string> = new GroupData(invitationFeature);

      forms.push(form);
    });

    return forms.sort((a, b) => a.order - b.order);
  }
}
