function drawBPs(map){


    //BP on the left
    const bpLeftCoord = [
        { lat: 49.672352, lng: 7.988743 },
        { lat: 49.67235,  lng: 7.988398 },
        { lat: 49.672105, lng: 7.988406 },
        { lat: 49.672107, lng: 7.988682 },
      ];
    
      // Construct the polygon.
      const bpLeft = new google.maps.Polygon({
        paths: bpLeftCoord,
        strokeColor: "#33FF33",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FFFFFF",
        fillOpacity: 0.00,
      });
    
      bpLeft.setMap(map);
  
       //BP on the right
       const bpRightCoord = [
        { lat: 49.672268, lng: 7.989103 },
        { lat: 49.672152, lng: 7.989372 },
        { lat: 49.671973, lng: 7.989114 },
        { lat: 49.672071, lng: 7.988898 },
        
      ];
    
      // Construct the polygon.
      const bpRight = new google.maps.Polygon({
        paths: bpRightCoord,
        strokeColor: "#33FF33",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FFFFFF",
        fillOpacity: 0.00,
      });
    
      bpRight.setMap(map);
  
  
         //Set polygon
         const bpCoord = [
          { lat: 49.672352, lng: 7.988743 },
          { lat: 49.672268, lng: 7.989103 },
          { lat: 49.672071, lng: 7.988898 },
          { lat: 49.672107, lng: 7.988682 },
        ];
      
        // Construct the polygon.
        const bp = new google.maps.Polygon({
          paths: bpCoord,
          strokeColor: "#3333FF",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FFFFFF",
          fillOpacity: 0.00,
        });
      
    bp.setMap(map);

}

export {drawBPs};