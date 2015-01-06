window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '1535462206712440',
	      xfbml      : true,
	      version    : 'v2.2'
	    });
	    checkLoginState();
	  };
	
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	
	function statusChangeCallback(response) {
	    //console.log('statusChangeCallback');
	    //console.log(response);
	    if (response.status === 'connected') {
	    	
	    	return;
	    	$('#fb-login').fadeOut();
	    	 FB.api('/me', {fields:"id,first_name,picture,email"}, function(me) {
		     	//console.log(me);
		    	 //meResponse.authToken=response.authResponse.authToken;
		     	$.post("/ajax/fb",{data:me});
		     	$("img.profile-small").attr('src',me.picture.data.url);
		     	$("img.profile-large").attr('src',me.picture.data.url);
		     	$("#fb-profile .username").html(me.first_name);
		     	$('#fb-profile').fadeIn();
		     	
		    });
	      // Logged into your app and Facebook.
	    } else if (response.status === 'not_authorized') {
	      // The person is logged into Facebook, but not your app.
	      /*document.getElementById('status').innerHTML = 'Please log ' +
	        'into this app.';*/
	    } else {
	      // The person is not logged into Facebook, so we're not sure if
	      // they are logged into this app or not.
	      /*document.getElementById('status').innerHTML = 'Please log ' +
	        'into Facebook.';*/
	       //alert("please login to facebook")
	    }
	  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }