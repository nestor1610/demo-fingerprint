import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  AcquisitionStarted,
  AcquisitionStopped,
  CommunicationFailed,
  DeviceConnected,
  DeviceDisconnected,
  DeviceInfo,
  ErrorOccurred,
  FingerprintReader,
  QualityReported,
  SampleFormat,
  SamplesAcquired
} from '@digitalpersona/devices';

import './core/modules/WebSdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'demo-fingerprint-reader';
  listaDispositivos: string[] = [];
  infoDispositivo: DeviceInfo;
  ultimaHuella: any = null;

  private reader: FingerprintReader;

  constructor() {
    this.reader = new FingerprintReader;
    this.infoDispositivo = {
      DeviceID: '',
      eUidType: 0,
      eDeviceModality: 0,
      eDeviceTech: 0,
    };
  }

  ngOnInit(): void {
    this.reader.on('DeviceConnected', this.onDeviceConnected);
    this.reader.on('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.on('SamplesAcquired', this.onSamplesAcquired);
    this.reader.on('AcquisitionStarted', this.onAcquisitionStarted);
    this.reader.on('AcquisitionStopped', this.onAcquisitionStopped);
  }

  ngOnDestroy(): void {
    this.reader.off('DeviceConnected', this.onDeviceConnected);
    this.reader.off('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.off('SamplesAcquired', this.onSamplesAcquired);
    this.reader.off('AcquisitionStarted', this.onAcquisitionStarted);
    this.reader.off('AcquisitionStopped', this.onAcquisitionStopped);
  }

  private onDeviceConnected = (event: DeviceConnected) => { }

  private onDeviceDisconnected = (event: DeviceDisconnected) => { };

  private onSamplesAcquired = (event: SamplesAcquired) => {
    this.ultimaHuella = this.fixBase64String(event.samples[0]);
  };

  private onQualityReported = (event: QualityReported) => { };

  private onErrorOccurred = (event: ErrorOccurred) => { };

  private onAcquisitionStarted = (event: AcquisitionStarted) => {
    console.log('Puedes ingresar la huella');
  };

  private onAcquisitionStopped = (event: AcquisitionStopped) => {
    console.log('Se detuvo la captura de huella');
  };

  private onCommunicationFailed = (event: CommunicationFailed) => { };

  informacioDispositivo() {
    this.reader.enumerateDevices().then(
      results => {
        this.reader.getDeviceInfo(results[0]).then(results => {

          if (results !== null) {
            this.infoDispositivo = results;
          }

        }).catch(error => {
          console.error(error);
        })
      }).catch(error => {
        console.error(error);
      })
  }

  initCapturarHuella() {
    this.reader.startAcquisition(SampleFormat.PngImage, this.infoDispositivo.DeviceID).then(response => {
    }).catch(error => {
      console.error(error);
    })
  }

  stopCapturarHuella() {
    this.reader.stopAcquisition(this.infoDispositivo.DeviceID).then(response => {
    }).catch(error => {
      console.error(error);
    })
  }

  fixBase64String(cadena: any) {
    let new_cadena = cadena;

    new_cadena = new_cadena.replace(/_/g, '/');
    new_cadena = new_cadena.replace(/-/g, '+');

    return new_cadena;
  }

}
