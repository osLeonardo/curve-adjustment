import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  default = [{ x: 0, y: 0 }];
  firstDegree = [
    { x: -2, y: -1 },
    { x: -1, y: 1 },
    { x: 0, y: 3 },
    { x: 1, y: 5 },
    { x: 2, y: 7 }
  ];
  secondDegree = [
    { x: -2, y: 15 },
    { x: -1, y: 8 },
    { x: 0, y: 3 },
    { x: 1, y: 0 },
    { x: 2, y: -1 }
  ];
  thirdDegree = [
    { x: -2, y: -31 },
    { x: -1, y: -7 },
    { x: 0, y: 3 },
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 9 },
    { x: 4, y: 23 }
  ];

  chart: any;
  mathFunction: string = '';
  typeOfFunction: number = 0;
  selectedExample: string = 'default';
  dataPairs: { x: number, y: number }[] = this.default;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
    this.typeOfFunction = this.identifyPolynomialDegree();
  }

  createChart(): void {
    Chart.register(...registerables);
    const ctx = this.canvas.nativeElement.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Função',
              data: this.dataPairs,
              parsing: {
                xAxisKey: 'x',
                yAxisKey: 'y'
              },
              backgroundColor: '#f29ee7',
              borderColor: '#5b005b',
              pointHoverRadius: 7,
              pointHoverBorderWidth: 3,
              pointBorderWidth: 3,
              pointStyle: 'circle',
              pointRadius: 7,
              fill: false,
              tension: 0.3,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              display: true,
              title: {
                display: true,
                text: 'X Axis'
              },
              beginAtZero: true,
            },
            y: {
              type: 'linear',
              display: true,
              title: {
                display: true,
                text: 'Y Axis'
              },
              beginAtZero: true,
            }
          }
        }
      });
    } else {
      console.error('Failed to get 2D context');
    }
  }

  addPair(): void {
    this.dataPairs.push({ x: 0, y: 0 });
  }

  removePair(): void {
    this.dataPairs.pop();
  }

  updatePairs(): void {
    switch (this.selectedExample) {
      case 'firstDegree':
        this.dataPairs = this.firstDegree;
        break;
      case 'secondDegree':
        this.dataPairs = this.secondDegree;
        break;
      case 'thirdDegree':
        this.dataPairs = this.thirdDegree;
        break;
      default:
        this.dataPairs = this.default;
    }
    this.addData();
  }

  addData(): void {
    if (this.chart) {
      this.typeOfFunction = this.identifyPolynomialDegree();
      this.chart.data.labels = this.dataPairs.map(pair => pair.x);
      this.chart.data.datasets[0].data = this.dataPairs.map(pair => pair.y);
      this.chart.update();
    }
  }

  resetChart(): void {
    this.dataPairs = this.default;
    this.addData();
  }

  calculateDifferences(values: number[]): number[] {
    const differences = [];
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1]);
    }
    return differences;
  }

  isConstant(arr: number[]): boolean {
    return arr.every(val => val === arr[0]);
  }

  identifyPolynomialDegree(): number {
    if (this.dataPairs.length < 2) {
      return 0;
    }
  
    const yValues = this.dataPairs.map(pair => pair.y);
  
    let firstDifferences = this.calculateDifferences(yValues);  
    if (this.isConstant(firstDifferences)) {
      return 1;
    }
  
    let secondDifferences = this.calculateDifferences(firstDifferences);  
    if (this.isConstant(secondDifferences)) {
      return 2;
    }
  
    let thirdDifferences = this.calculateDifferences(secondDifferences);  
    if (this.isConstant(thirdDifferences)) {
      return 3;
    }
  
    return 0;
  }
}