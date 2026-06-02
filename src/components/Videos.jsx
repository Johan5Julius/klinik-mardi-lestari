import { motion } from 'framer-motion';
import './Videos.css';

export default function Videos() {
  const videos = [
    { id: '1', title: 'Membahas Faktor Hipertensi', url: 'https://www.youtube.com/embed/0CvPzjJ9w0Q' },
    { id: '2', title: 'Apa Itu Kolestrol', url: 'https://www.youtube.com/embed/rFDeY6hNIg0' }
  ];

  return (
    <div className="videos-grid">
      {videos.map((vid, idx) => (
        <motion.div 
          key={vid.id}
          className="video-card glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.2 }}
        >
          <div className="video-wrapper">
            <iframe 
              src={vid.url} 
              title={vid.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-info">
            <h3>{vid.title}</h3>
            <p>Learn more about maintaining your health with our expert advice.</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
