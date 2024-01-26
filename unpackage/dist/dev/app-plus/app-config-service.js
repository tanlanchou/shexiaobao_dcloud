
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","titleNView":false,"navigationBar":{"backgroundColor":"#F8F8F8","type":"default","style":"custom","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"shexiaodun","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"3.99","entryPagePath":"pages/index/index","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/index/index","meta":{"isQuit":true,"isEntry":true,"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/outer/login","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/outer/register","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/outer/forget","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/index/functions","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/index/role/roleList","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/index/role/roleAdd","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/index/user/list","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/index/user/detail","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/attachment/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/attachment/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/material/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/material/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/origin/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/origin/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/quality/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/quality/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/storehouse/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/storehouse/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/tag/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/tag/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/type/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/type/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/category/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/category/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/people/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/people/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/tag/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/tag/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/origin/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/customer/origin/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/info/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/product/info/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/order/info/list","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/order/info/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/order/channels/index","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}},{"path":"pages/order/channels/add","meta":{"titleNView":false,"navigationBar":{"type":"default","style":"custom"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  