import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  //defaultPair = [{ x: 0, y: 0 }];
  defaultPair = [{ x: 10, y: 20 }, { x: 25, y: 30 },{ x: 90, y: 50 }];
  public chart: any;
  public dataPairs: { x: number, y: number }[] = this.defaultPair;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
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
              data: this.dataPairs,  // Use the original data pairs directly
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
}