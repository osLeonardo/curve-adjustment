import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  //defaultPair = [{ x: 0, y: 0 }];
  // defaultPair = [ // Primeiro Grau
  //   { x: -2, y: -1 },
  //   { x: -1, y: 1 },
  //   { x: 0, y: 3 },
  //   { x: 1, y: 5 },
  //   { x: 2, y: 7 }
  // ];
  // defaultPair = [ // Segundo Grau
  //   { x: -2, y: 15 },
  //   { x: -1, y: 8 },
  //   { x: 0, y: 3 },
  //   { x: 1, y: 0 },
  //   { x: 2, y: -1 }
  // ]
  defaultPair = [ // Terceiro Grau
    { x: -3, y: -20 },
    { x: -2, y: -4 },
    { x: -1, y: 0 },
    { x: 1, y: -4 },
    { x: 2, y: 0 },
    { x: 3, y: 16 }
  ]

  public chart: any;
  public dataPairs: { x: number, y: number }[] = this.defaultPair;
  mathFunction:string = '';
  typeOfFunction:number = -1;

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
              borderColor: '#3cba9f',
              fill: false,
              tension: 0.3,
            },
            {
              label: 'Pontos X, Y',
              data: this.dataPairs,
              parsing: {
                xAxisKey: 'x',
                yAxisKey: 'y'
              },
              pointStyle: 'circle',
              pointRadius: 8,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              showLine: false,
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

  addData(): void {
    if (this.chart) {
      this.chart.data.labels = this.dataPairs.map(pair => pair.x);
      this.chart.data.datasets[0].data = this.dataPairs.map(pair => pair.y);
      this.chart.data.datasets[1].data = this.dataPairs.map(pair => pair.y);
      this.chart.update();
    }
  }

  resetChart(): void {
    this.dataPairs = this.defaultPair;
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
  parseMathFunction(): void {
    console.log(this.identifyPolynomialDegree())

    const regexPrimeiroGrau = /^y\s*=\s*([+-]?\d*\.?\d*)\s*\*?\s*x\s*([+-]?\s*\d*\.?\d*)?$/i;
    const regexSegundoGrau = /^y\s*=\s*([+-]?\d*\.?\d*)\s*\*?\s*x\^2\s*([+-]?\s*\d*\.?\d*)\s*\*?\s*x\s*([+-]?\s*\d*\.?\d*)?$/i;
    const regexTerceiroGrau = /^y\s*=\s*([+-]?\d*\.?\d*)?\s*\*?\s*x(\*\*3|\^3)\s*([+-]\s*\d*\.?\d*)?\s*\*?\s*x(\*\*2|\^2)?\s*([+-]\s*\d*\.?\d*)?\s*\*?\s*x\s*([+-]\s*\d*\.?\d*)?$/i;

    const preProcessFunction = (func: string) => {
      // Substitui "^" por "**" e remove espaços extras ao redor de "**"
      return func.replace(/\^/g, '**').replace(/\s*\*\*\s*/g, '**').trim();
    };
    
    // Pré-processa a função para a de terceiro grau
    const processedMathFunction = preProcessFunction(this.mathFunction);

    const matchPrimeiroGrau = this.mathFunction.match(regexPrimeiroGrau);
    const matchSegundoGrau = this.mathFunction.match(regexSegundoGrau);
    const matchTerceiroGrau = processedMathFunction.match(regexTerceiroGrau);

    console.log(matchTerceiroGrau)
  
    let generatedPairs = [];
  
    if (matchPrimeiroGrau) {
      this.typeOfFunction = 1;
      const m = parseFloat(matchPrimeiroGrau[1]) || 1;
      const b = parseFloat(matchPrimeiroGrau[2]?.replace(/\s+/g, '') || '0');
      for (let x = -10; x <= 10; x += 0.5) {
        const y = m * x + b;
        generatedPairs.push({ x, y });
      }
  
    } else if (matchSegundoGrau) {
      this.typeOfFunction = 2;
      const a = parseFloat(matchSegundoGrau[1]) || 1;
      const b = parseFloat(matchSegundoGrau[2]?.replace(/\s+/g, '') || '0');
      const c = parseFloat(matchSegundoGrau[3]?.replace(/\s+/g, '') || '0');
      for (let x = -10; x <= 10; x += 0.5) {
        const y = a * x ** 2 + b * x + c;
        generatedPairs.push({ x, y });
      }
  
    } else if (matchTerceiroGrau) {
      this.typeOfFunction = 3;
      const a = parseFloat(matchTerceiroGrau[1]) || 1;
      const b = parseFloat(matchTerceiroGrau[3]?.replace(/\s+/g, '') || '0');
      const c = parseFloat(matchTerceiroGrau[5]?.replace(/\s+/g, '') || '0');
      const d = parseFloat(matchTerceiroGrau[6]?.replace(/\s+/g, '') || '0');
      for (let x = -10; x <= 10; x += 0.5) {
        const y = a * x ** 3 + b * x ** 2 + c * x + d;
        generatedPairs.push({ x, y });
      }
  
    } else {
      alert('Função inválida. Por favor, insira uma função de primeiro, segundo grau ou terceiro grau.')
      console.error('Função inválida. Por favor, insira uma função de primeiro, segundo grau ou terceiro grau.');
      return;
    }

    if (this.chart) {
      this.chart.data.datasets[0].data = generatedPairs;
      this.chart.options.scales.x.min =Math.min(...generatedPairs.map(pair => pair.x));
      this.chart.options.scales.x.max =Math.max(...generatedPairs.map(pair => pair.x));
      this.chart.options.scales.y.min =Math.min(...generatedPairs.map(pair => pair.x));
      this.chart.options.scales.y.max =Math.max(...generatedPairs.map(pair => pair.x));
      this.chart.update();
    }
    console.log(this.typeOfFunction)
  }
}