import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";

@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {

  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm('You have unsaved changes, are you sure you want to discard them by continuing?');
    } else {
      return true;
    }
  }
}
