import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import React from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import './Gravacao.css';

const Gravacao: React.FC = () => {
  const [photo, setPhoto] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [webcamActive, setWebcamActive] = React.useState(false);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      setPhoto(image.dataUrl || null);
      // Salvar foto no Preferences
      const { value } = await Preferences.get({ key: 'photos' });
      let photos: string[] = value ? JSON.parse(value) : [];
      photos = [image.dataUrl || '', ...photos];
      await Preferences.set({ key: 'photos', value: JSON.stringify(photos) });
    } catch (err) {
      alert('Erro ao tirar foto: ' + err);
    }
  };

  // Função para ativar webcam
  const startWebcam = async () => {
    setWebcamActive(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        alert('Não foi possível acessar a webcam: ' + err);
      }
    }
  };

  // Função para capturar foto da webcam
  const captureWebcamPhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl);
        // Salvar foto no Preferences
        const { value } = await Preferences.get({ key: 'photos' });
        let photos: string[] = value ? JSON.parse(value) : [];
        photos = [dataUrl, ...photos];
        await Preferences.set({ key: 'photos', value: JSON.stringify(photos) });
      }
    }
    // Parar webcam após captura
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tirar Foto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tirar Foto</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={takePhoto} style={{ padding: '12px 24px', fontSize: 18, marginRight: 16 }}>Tirar Foto (Mobile)</button>
          <button onClick={startWebcam} style={{ padding: '12px 24px', fontSize: 18 }}>Tirar Foto (Webcam)</button>
          {webcamActive && (
            <div style={{ marginTop: 24 }}>
              <video ref={videoRef} style={{ width: '90%', borderRadius: 8 }} autoPlay playsInline />
              <br />
              <button onClick={captureWebcamPhoto} style={{ marginTop: 12, padding: '8px 20px', fontSize: 16 }}>Capturar Foto</button>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}
          {photo && (
            <div style={{ marginTop: 24 }}>
              <img src={photo} alt="Foto tirada" style={{ maxWidth: '90%', borderRadius: 8 }} />
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Gravacao;
