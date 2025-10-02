import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import React from 'react';
import { useIonViewWillEnter } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import './Galeria.css';

const Galeria: React.FC = () => {
  const [photos, setPhotos] = React.useState<string[]>([]);


  const loadPhotos = async () => {
    const { value } = await Preferences.get ({ key: 'photos' });
    if (value) {
      setPhotos(JSON.parse(value));
    } else {
      // Mock inicial
      setPhotos([
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
      ]);
    }
  };

  useIonViewWillEnter(() => {
    loadPhotos();
  });

  const excluirFoto = async (idx: number) => {
    const novasFotos = [...photos];
    novasFotos.splice(idx, 1);
    setPhotos(novasFotos);
    await Preferences.set({ key: 'photos', value: JSON.stringify(novasFotos) });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galeria de Fotos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Galeria de Fotos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          {photos.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'inline-oabblock' }}>
              <img src={url} alt={`Foto ${idx + 1}`} style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8 }} />
              <button onClick={() => excluirFoto(idx)} style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 'bold', fontSize: 18 }}>×</button>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Galeria;
