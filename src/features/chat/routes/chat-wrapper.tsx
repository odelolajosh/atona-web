import { Outlet } from 'react-router-dom';
import { UploadProvider } from '../components/uploader/uploader';
import { Helmet } from 'react-helmet-async';


const variables = {
  "--chat-header-height": "4rem",
  "--chat-list-width": "350px",
} as const

const ChatWrapper = () => (
  <UploadProvider>
    <main className="h-full" style={variables as React.CSSProperties}>
      <Helmet>
        <title>Chat - Atona GCS</title>
      </Helmet>
      <Outlet />
    </main>
  </UploadProvider>
)

export { ChatWrapper }