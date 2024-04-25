import { RouteObject } from 'react-router-dom';
import { VideoStream } from './video-stream';

const vsRoutes: RouteObject[] = [
  { path: 'vs', element: <VideoStream /> }
]

export default vsRoutes;