import { createAction, props } from '@ngrx/store';
import { TestimonialData } from '@models';

export enum TestimonialActionTypes {
  LoadAllTestimonial = '[TESTIMONIAL] Load All Testimonial',
  LoadAllTestimonialSuccess = '[TESTIMONIAL] Load All Testimonial Success',
  LoadAllTestimonialFailure = '[TESTIMONIAL] Load All Testimonial Failure',
  LoadTestimonial = '[TESTIMONIAL] Load Testimonial',
  LoadTestimonialSuccess = '[TESTIMONIAL] Load Testimonial Success',
  LoadTestimonialFailure = '[TESTIMONIAL] Load Testimonial Failure',
  CreateTestimonial = '[TESTIMONIAL] Create Testimonial',
  CreateTestimonialSuccess = '[TESTIMONIAL] Create Testimonial Success',
  CreateTestimonialFailure = '[TESTIMONIAL] Create Testimonial Failure',
  UpdateTestimonial = '[TESTIMONIAL] Update Testimonial',
  UpdateTestimonialSuccess = '[TESTIMONIAL] Update Testimonial Success',
  UpdateTestimonialFailure = '[TESTIMONIAL] Update Testimonial Failure',
  DeleteTestimonial = '[TESTIMONIAL] Delete Testimonial',
  DeleteTestimonialSuccess = '[TESTIMONIAL] Delete Testimonial Success',
  DeleteTestimonialFailure = '[TESTIMONIAL] Delete Testimonial Failure',
  ClearTestimonial = '[TESTIMONIAL] Clear Testimonial',
}

// Load All
export const loadAllTestimonial = createAction(
  TestimonialActionTypes.LoadAllTestimonial,
  props<{ params: any; pagination: boolean; infinite: boolean }>()
);

export const loadAllTestimonialSuccess = createAction(
  TestimonialActionTypes.LoadAllTestimonialSuccess,
  props<{ data: TestimonialData[]; pagination: any }>()
);

export const loadAllTestimonialFailure = createAction(
  TestimonialActionTypes.LoadAllTestimonialFailure,
  props<{ error: Error | any }>()
);

// Load Single
export const loadTestimonial = createAction(
  TestimonialActionTypes.LoadTestimonial,
  props<{ id: string; params: any }>()
);

export const loadTestimonialSuccess = createAction(
  TestimonialActionTypes.LoadTestimonialSuccess,
  props<{ data: TestimonialData }>()
);

export const loadTestimonialFailure = createAction(
  TestimonialActionTypes.LoadTestimonialFailure,
  props<{ error: Error | any }>()
);

// Create
export const createTestimonial = createAction(
  TestimonialActionTypes.CreateTestimonial,
  props<{ create: any }>()
);

export const createTestimonialSuccess = createAction(
  TestimonialActionTypes.CreateTestimonialSuccess,
  props<{ data: TestimonialData }>()
);

export const createTestimonialFailure = createAction(
  TestimonialActionTypes.CreateTestimonialFailure,
  props<{ error: Error | any }>()
);

// Update
export const updateTestimonial = createAction(
  TestimonialActionTypes.UpdateTestimonial,
  props<{ update: any }>()
);

export const updateTestimonialSuccess = createAction(
  TestimonialActionTypes.UpdateTestimonialSuccess,
  props<{ data: TestimonialData }>()
);

export const updateTestimonialFailure = createAction(
  TestimonialActionTypes.UpdateTestimonialFailure,
  props<{ error: Error | any }>()
);

// Delete
export const deleteTestimonial = createAction(
  TestimonialActionTypes.DeleteTestimonial,
  props<{ delete: any }>()
);

export const deleteTestimonialSuccess = createAction(
  TestimonialActionTypes.DeleteTestimonialSuccess,
  props<{ data: TestimonialData }>()
);

export const deleteTestimonialFailure = createAction(
  TestimonialActionTypes.DeleteTestimonialFailure,
  props<{ error: Error | any }>()
);

// Clear
export const clearTestimonial = createAction(TestimonialActionTypes.ClearTestimonial);

export const fromTestimonialActions = {
  loadAllTestimonial,
  loadAllTestimonialSuccess,
  loadAllTestimonialFailure,
  loadTestimonial,
  loadTestimonialSuccess,
  loadTestimonialFailure,
  createTestimonial,
  createTestimonialSuccess,
  createTestimonialFailure,
  updateTestimonial,
  updateTestimonialSuccess,
  updateTestimonialFailure,
  deleteTestimonial,
  deleteTestimonialSuccess,
  deleteTestimonialFailure,
  clearTestimonial,
};
