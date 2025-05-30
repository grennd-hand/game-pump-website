import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GamePump - 去中心化游戏启动平台',
  description: 'Solana上的游戏代币发现和交易平台',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <head>
        {/* 第三方服务集成 */}
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'FB_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
        
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
            `,
          }}
        />
        
        {/* Intercom客服 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.intercomSettings = {
                app_id: "INTERCOM_APP_ID"
              };
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/INTERCOM_APP_ID';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
            `,
          }}
        />
        
        {/* 错误监控 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 简单的错误捕获
              window.onerror = function(msg, url, line, col, error) {
                console.error('页面错误:', {msg, url, line, col, error});
                // 可以发送到错误监控服务
                fetch('/api/error-log', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({msg, url, line, col, error: error?.toString()})
                }).catch(e => console.log('错误上报失败'));
              };
              
              // Promise错误捕获
              window.addEventListener('unhandledrejection', function(event) {
                console.error('未处理的Promise错误:', event.reason);
                fetch('/api/error-log', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({type: 'promise', error: event.reason?.toString()})
                }).catch(e => console.log('错误上报失败'));
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
} 