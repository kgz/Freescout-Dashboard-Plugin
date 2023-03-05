<button id="jira_connect">Connect</button>
    <script type="text/javascript">

    /** Myob api handler */
	var myob_popupCenter = function({url, title, w, h}) {
        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const newWindow = window.open(url, title, 
        `
        scrollbars=yes,
        width=${w / systemZoom}, 
        height=${h / systemZoom}, 
        top=${top}, 
        left=${left}
        `
        )
		newWindow.document.title = title;

        if (window.focus) newWindow.focus();
		return newWindow;
    }
    let button = document.getElementById('jira_connect');
    console.log(button);
    button.onclick =  function (){
        const scopes = [
            'read:me',
            "read",
            "read:jira-work",
            "read:jira-work:all",
            "read:jira-user",
            "read",
            "offline_access",
            "write:jira-work"
    
        ]
        const scope = scopes.join(" ");
        // url encode scope
        const scopeEncoded = encodeURIComponent(scope);
        const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // // set state in session
        // // $.post('/index.php?container=globe&ajax=jira_api&run=setState', {state}, function (data){
        // //     console.log(data);
        // // })
        // fetch('/index.php?container=globe&ajax=jira_api&run=setState', {
        //     method: 'POST',
        //     body: JSON.stringify({state}),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(response => response.json())

        const url = 
            `https://auth.atlassian.com/authorize?` +
            `audience=api.atlassian.com&`+
            `client_id=fFz6c0TOfHT7bcdfGMRUBkrvFaNIsf4I&`+
            `scope=${scopeEncoded}&`+
            `redirect_uri=https%3A%2F%2Flocal-second.datanova.com.au%2Findex.php%3Fcontainer%3Dglobe%26ajax%3Djira_api_callback&`+
            `state=${state}&`+
            `response_type=code&`+
            `prompt=consent`;

        const w = myob_popupCenter({url, title: 'Jira Connect', w: 600, h: 600});


    }
   
</script>

