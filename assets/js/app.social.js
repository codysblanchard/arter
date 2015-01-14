angular.module('fb',[])
.directive('fb', ['$FB', function($FB) {
        return {
            restrict: "E",
            replace: true,
            template: "<div id='fb-root'><fb:login-button scope='public_profile,email' onlogin='fbLogin();' onclick='FB.login();'></fb></div>",
            compile: function(tElem, tAttrs) {
                return {
                    post: function(scope, iElem, iAttrs, controller) {
                        var fbAppId = iAttrs.appId || '';
 
                        var fb_params = {
                            appId: iAttrs.appId || "",
                            cookie: iAttrs.cookie || true,
                            status: iAttrs.status || true,
                            xfbml: iAttrs.xfbml || true
                        };
                        
                        window.fbLogin = function(){
                        	FB.api('/me', {fields: 'id,last_name,first_name,email,picture'}, function(response) {
							  scope.user={
							  	name:response.first_name,
							  	email:response.email,
							  	social:'fb',
							  	socialID:response.id,
							  	image:response.picture.data.url
							  };
							  scope.$apply();
							});

                        }
                        window.fbLogout = function(){
                        	FB.logout(function(){
                        		scope.user=null;
                        		scope.$apply();
                        	},scope.loginToken);
                        	
                        }
 
                        // Setup the post-load callback
                        window.fbAsyncInit = function() {
                            $FB._init(fb_params);
 
                            if('fbInit' in iAttrs) {
                                iAttrs.fbInit();
                            }
                        };
 
                        (function(d, s, id, fbAppId) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return;
                            js = d.createElement(s); js.id = id; js.async = true;
                            js.src = "//connect.facebook.net/en_US/all.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }(document, 'script', 'facebook-jssdk', fbAppId));
                    }
                };
            }
        };
    }])
    
    .factory('$FB', ['$rootScope', function($rootScope) {
 
        var fbLoaded = false;
 
        // Our own customisations
        var _fb =  {
            loaded: fbLoaded,
            _init: function(params) {
                if(window.FB) {
                    // FIXME: Ugly hack to maintain both window.FB
                    // and our AngularJS-wrapped $FB with our customisations
                    angular.extend(window.FB, _fb);
                    angular.extend(_fb, window.FB);
 
                    // Set the flag
                    _fb.loaded = true;
 
                    // Initialise FB SDK
                    window.FB.init(params);
 
                    if(!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    
                    FB.getLoginStatus(function(response){
                    	if(response.status=="connected"){
                    		$rootScope.loginToken=response.authResponse.accessToken;
                    		window.fbLogin();
                    	}
                    });
                }
            }
        };
 
        return _fb;
    }]);
  
