import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// SERVICE
import { GlobalService } from '@services';

// COMPONENT
import { AvatarComponent } from '@components/_components/avatar/avatar.component';

// PACKAGE
import _ from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kb-avatar-item',
  templateUrl: './avatar-item.component.html',
  styleUrls: ['./avatar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarItemComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  moment: any = moment;

  @ViewChild('dynamicComponent', { static: false, read: ViewContainerRef }) myRef!: ViewContainerRef;

  @Input() avatar!: any;
  @Input() primaryText = '';
  @Input() secondaryText = '';
  @Input() isTruncation = false;
  defaultInputs$ = new BehaviorSubject<any>({
    avatar: null,
    primaryText: '',
    secondaryText: '',
    isTruncation: false,
  });

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private translateService: TranslateService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.defaultInputs$.next({ ...this.defaultInputs$.getValue(), ...this.checkInputs() });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputs = Object.keys(changes).reduce((result: any, item: any) => {
      result[item] = changes[item].currentValue;
      return result;
    }, {});

    this.defaultInputs$.next({ ...this.defaultInputs$.getValue(), ...inputs });
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.loadComponent();
  }

  checkInputs(): any {
    const inputs = {};

    if (!_.isNil(this.avatar)) {
      _.assign(inputs, { avatar: this.avatar });
    }

    if (!_.isNil(this.primaryText)) {
      _.assign(inputs, { primaryText: this.primaryText });
    }

    if (!_.isNil(this.secondaryText)) {
      _.assign(inputs, { secondaryText: this.secondaryText });
    }

    if (!_.isNil(this.isTruncation)) {
      _.assign(inputs, { isTruncation: this.isTruncation });
    }

    return inputs;
  }

  loadComponent(): void {
    const componentRef = this.myRef.createComponent(AvatarComponent);

    this.defaultInputs$.subscribe((inputs) => {
      if (inputs.avatar.appearance) {
        componentRef.instance.appearance = inputs.avatar.appearance;
      }

      if (inputs.avatar.size) {
        componentRef.instance.size = inputs.avatar.size;
      }

      if (inputs.avatar.src) {
        componentRef.instance.src = inputs.avatar.src;
      }
    });

    componentRef.changeDetectorRef.detectChanges();
  }
}
