import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import React from 'react';
import { useIonViewWillEnter } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import './Galeria.css';

type Video = {
  id: string;
  title: string;
  thumb: string;
  url: string;
  date: number; // Timestamp
};

const listaVideosMock: Video[] = [
  {
    id: '1',
    title: 'Vídeo 1',
    thumb: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    date: 1625155200000 // 1 de julho de 2021
  },
  {
    id: '2',
    title: 'Vídeo 2',
    thumb: 'https://img.youtube.com/vi/tAGnKpE4NCI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=tAGnKpE4NCI',
    date: 1625241600000 // 2 de julho de 2021
  },
  {
    id: '3',
    title: 'Vídeo 3',
    thumb: 'https://img.youtube.com/vi/JGwWNGJk1Zw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    date: 1625328000000 // 3 de julho de 2021
  }
];

const Galeria: React.FC = () => {

  const [videos, setVideos] = React.useState<Video[]>(listaVideosMock);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Samuflix</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Samuflix</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="video-list">
          {videos.map((v) => (
            <div className="video-card" key={v.id} onClick={() => alert(v.id)} role="button" tabIndex={0}>
              <img className="video-thumb" src={v.thumb} alt={v.title} />
              <div className="video-meta">
                <div className="video-title">{v.title}</div>
                <div className="video-date">Publicado em {(v.date)}</div>
              </div>
            </div>
          ))}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Galeria;
