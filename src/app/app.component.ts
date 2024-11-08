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
  defaultPair = { x: 0, y: 0 };
  public chart: any;
  public dataPairs: { x: number, y: number }[] = [this.defaultPair];

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
          labels: this.dataPairs.map(pair => pair.x),
          datasets: [
            {
              label: 'Data',
              data: this.dataPairs.map(pair => pair.y),
              borderColor: '#3cba9f',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'X Axis'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Y Axis'
              }
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
      this.chart.update();
    }
  }

  resetChart(): void {
    this.dataPairs = [this.defaultPair];
    this.addData();
  }
}