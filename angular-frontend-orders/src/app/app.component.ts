import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Lista de Pedidos';
  orders: any;

  dtOptions = {};

  constructor() {
    this.orders = [];
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
    };

    axios
      .get(`http://orders-service:3000/microservice-orders/v1/orders`, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
      .then((res) => {
        this.orders = res.data;
      });
  }
}
