
                                               
        let uluru;
        let map; 
        let marker;
        let ws;
        let player={}
        let nick=window.prompt("Your Name ?")
        function initMap() {                   
            uluru = {lat: 50.068160, lng: 18.941041};
            map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10, center: uluru, keyboardShortcuts: false});
            marker = new google.maps.Marker({position: uluru, map: map, animation: google.maps.Animation.BOUNCE,});

                                               
        google.maps.event.addListener(map, 'mousemove', function(e)
         {
                marker.setPosition(e.latLng);  
                var lat = marker.getPosition().lat(); 
                var lng = marker.getPosition().lng();
                let wsData={lat:lat, lng:lng, id:nick}
                ws.send(JSON.stringify(wsData))
        });
        getLocalization()
        startWebSocket()
        addKeyboardEvents()
      }
      function getLocalization(){               
        navigator.geolocation.getCurrentPosition(geoOk,geoFail)
      }
      function geoOk(data){                     
          console.log(data)
          let coords = {
              lat: data.coords.latitude,
              lng: data.coords.longitude}
            map.setCenter(coords);
            marker.setPosition(coords);
      }
      function geoFail(err){                    
          console.log(err)
      }
                                               
      function addKeyboardEvents(){
          window.addEventListener("keydown", poruszMarkerem)
      }
      function poruszMarkerem(ev){
          let lat = marker.getPosition().lat();
          let lng = marker.getPosition().lng();
        switch(ev.code){                        
            case 'ArrowUp':
            lat+=0.1;
            break;
            case 'ArrowDown':
            lat-=0.1;            
            break;
            case 'ArrowLeft':
            lng-=0.1;
            break;
            case 'ArrowRight':
            lng+=0.1;
            break;
        }
        let position={lat,lng}
        let wsData={lat:lat, lng:lng, id:nick}
        marker.setPosition(position)        
        ws.send(JSON.stringify(wsData))         
      }

      function startWebSocket(){                
      
        let url= 'ws://szkolenia.design.net.pl:8010'
        ws = new WebSocket(url);
        ws.addEventListener('open',onWSOpen);
        ws.addEventListener('message',onWSMessage);
      }

      function onWSOpen(data){               
          console.log(data)
      }
      function onWSMessage(e){               
          
          let data=JSON.parse(e.data)
          console.log("data received",data)     
                                                
          if(!player['user'+ data.id]&&data.id!==nick){ 
              player['user'+ data.id]= new google.maps.Marker({
                  position: {lat:data.lat,lng:data.lng},
                  map:map
              })
          }
          else if(data.id!==nick){            
            player['user'+ data.id].position=
            {
                lat:data.lat,lng:data.lng
            }
            player['user'+ data.id].setPosition(player['user'+ data.id].position) 


        }
        
          
    }
          
      
  