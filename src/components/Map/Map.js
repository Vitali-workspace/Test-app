import { Link, NavLink } from 'react-router-dom';
import './Login.css';

import mapForest from '../../images/forest.png';
import maptest from '../../images/map1.png';

function Map() {

  return (
    <section className='map'>
      <div className='map_forest'>{mapForest}</div>
    </section>
  );
}

export default Map;