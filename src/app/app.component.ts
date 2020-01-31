import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { guid } from '@progress/kendo-angular-common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'example';
  products: Product[];
  constructor(
    private formBuilder: FormBuilder,
    ) {
      this.products = [];
  }

  ngOnInit(): void {
  }

  saveChanges(form: any) {

  }

  addHandler( { sender }) {
    sender.addRow(this.createFormGroup(new Product()));
  }

  public saveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      sender.closeRow(rowIndex);
      formGroup.value.id = guid();
      console.log(formGroup.value);
      this.products.push(formGroup.value);
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      id: dataItem.id,
      name: dataItem.name,
      price: dataItem.price
    });
  }

  public removeHandler({ sender, dataItem }) {
    console.log(dataItem);
    this.products = this.products.filter((product) => product.id !== dataItem.id );
    console.log(this.products);
    sender.cancelCell();
  }

  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      const productUpdate = this.products.find((product) => product.id === dataItem.id);
      productUpdate.change(formGroup.value);
    }
  }

  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited
  }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

}

export class Product {
  public id: string;
  public name: string;
  public price: number;
  constructor(id = '' , name = '', price = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
  change( newVal: any) {
    this.name = newVal.name;
    this.price = newVal.price;
  }
}
