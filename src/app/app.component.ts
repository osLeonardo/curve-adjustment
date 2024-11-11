import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
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
    { x: -3, y: -20 },
    { x: -2, y: -4 },
    { x: -1, y: 0 },
    { x: 1, y: -4 },
    { x: 2, y: 0 },
    { x: 3, y: 16 }
  ];

  chart: any;
  mathFunction: string = '';
  typeOfFunction: number = -1;
  selectedExample: string = 'firstDegree';
  dataPairs: { x: number, y: number }[] = this.firstDegree;

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
              min: Math.min(...this.dataPairs.map(pair => pair.x)),
              max: Math.max(...this.dataPairs.map(pair => pair.x))
            },
            y: {
              type: 'linear',
              display: true,
              title: {
                display: true,
                text: 'Y Axis'
              },
              beginAtZero: true,
              min: Math.min(...this.dataPairs.map(pair => pair.y)),
              max: Math.max(...this.dataPairs.map(pair => pair.y))
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
        this.dataPairs = this.firstDegree;
    }
    this.addData();
  }

  addData(): void {
    if (this.chart) {
      this.chart.data.labels = this.dataPairs.map(pair => pair.x);
      this.chart.data.datasets[0].data = this.dataPairs.map(pair => pair.y);
      this.chart.data.datasets[1].data = this.dataPairs.map(pair => pair.y);
      this.chart.update();
    }
  }

  resetChart(): void {
    this.dataPairs = this.firstDegree;
    this.addData();
  }

  // Função para calcular as diferenças de uma lista de valores
   calculateDifferences(values: number[]): number[] {
    const differences = [];
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1]);
    }
    return differences;
  }

  // Função para verificar se um array de números é constante (se todos os valores são iguais)
   isConstant(arr: number[]): boolean {
    return arr.every(val => val === arr[0]);
  }

  // Função principal para identificar o grau do polinômio
  identifyPolynomialDegree(): number {
    const yValues = this.dataPairs.map(pair => pair.y);
    console.log(yValues)

    // Primeiras diferenças
    let firstDifferences = this.calculateDifferences(yValues);
    console.log("Primeiras Diferenças:", firstDifferences);

    if (this.isConstant(firstDifferences)) {
      return 1; // Função de primeiro grau (linear)
    }

    // Segundas diferenças
    let secondDifferences = this.calculateDifferences(firstDifferences);
    console.log("Segundas Diferenças:", secondDifferences);

    if (this.isConstant(secondDifferences)) {
      return 2; // Função de segundo grau (quadrática)
    }

    // Terceiras diferenças
    let thirdDifferences = this.calculateDifferences(secondDifferences);
    console.log("Terceiras Diferenças:", thirdDifferences);

    if (this.isConstant(thirdDifferences)) {
      return 3; // Função de terceiro grau (cúbica)
    }

    return 0; // Função de grau superior a 3 ou que não é polinomial
  }
}