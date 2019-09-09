/** Cette page permet à l'utilisateur d'indiquer le nombre d'individus observés par classe (adultes, mâles, femelles, etc. */

import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";

@Component({
  selector: 'page-abondance',
  templateUrl: 'abondance.page.html'
})
export class AbondancePage implements OnInit {

  observation: SimpleObservationModel;

  constructor(
    public nc: NavController,
    private np: NavParams) {
  }

  saveInsert() {
    this.nc.push(InsertFormPage, {
      'obs': this.observation
    })
  }

  ngOnInit() {
    this.observation = this.np.get('obs');
  }

}
