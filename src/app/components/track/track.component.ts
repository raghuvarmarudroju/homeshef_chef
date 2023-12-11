import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  standalone: true,
})
export class TrackComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  googleMaps: any;
  @Input() order;
  @Output() duration: EventEmitter<any> = new EventEmitter();
  // interval: any;
  directionsService: any;
  directionsDisplay: any;
  prevLat: any;
  prevLng: any;

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2,
    private global: GlobalService
    ) { }

  ngOnInit() {}

  async ngAfterViewInit() {
    console.log('afterviewinit mapcomponent');
    console.log('order: ', this.order);
    if(this.order && this.order?.rider) {
      this.loadMap();   
    }
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;

      this.directionsService = new googleMaps.DirectionsService;
      this.directionsDisplay = new googleMaps.DirectionsRenderer;
      this.directionsDisplay = new googleMaps.DirectionsRenderer();
      // const bounds = new googleMaps.LatLngBounds;
      
      let source_lat = this.order?.address?.lat;
      let source_lng = this.order?.address?.lng;
      let dest_lat = this.restLat();
      let dest_lng = this.restLng();
      // let source_lat = this.profile?.latitude;
      // let source_lng = this.profile?.longitude;
      // let dest_lat = this.order?.status == 'Picked' ? this.order?.address?.lat : this.order?.chef?.latitude;
      // let dest_lng = this.order?.status == 'Picked' ? this.order?.address?.lng : this.order?.chef?.longitude;    
    
      // const source = { lat: parseFloat(source_lat), lng: parseFloat(source_lng) };
      // const destination = { lat: parseFloat(dest_lat), lng: parseFloat(dest_lng) };

      const mapEl = this.mapElementRef.nativeElement;
  
      // const sourceIconUrl = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
      // const destinationIconUrl = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';

      const sourceIconUrl = 'assets/icons/chef.png';
      const destinationIconUrl = 'assets/icons/navigator.png';

      const map = new googleMaps.Map(mapEl, {
        center: { lat: source_lat, lng: source_lng },
        disableDefaultUI: true,
        zoom: 14,
        // mapTypeId: googleMaps.MapTypeId.ROADMAP
      });
      
      const source_position = new googleMaps.LatLng(source_lat, source_lng);
      const destination_position = new googleMaps.LatLng(dest_lat, dest_lng);
      const rider_position = new googleMaps.LatLng(this.riderLat(), this.riderLng());
  
      const rider_icon = {
        url: 'assets/icons/motorbike.png',
        scaledSize: new googleMaps.Size(50, 50), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0) // anchor
      };
      const source_icon = {
        url: sourceIconUrl,
        scaledSize: new googleMaps.Size(50, 50), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0) // anchor
      };
      const destination_icon = {
        url: destinationIconUrl,
        scaledSize: new googleMaps.Size(50, 50), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0) // anchor
      };
      const source_marker = new googleMaps.Marker({
        map: map,
        position: source_position,
        animation: googleMaps.Animation.DROP,
        icon: source_icon,
      });

      const rider_marker = new googleMaps.Marker({
        map: map,
        position: rider_position,
        animation: googleMaps.Animation.DROP,
        icon: rider_icon,
      });

      const destination_marker = new googleMaps.Marker({
        map: map,
        position: destination_position,
        animation: googleMaps.Animation.DROP,
        icon: destination_icon
      });
      source_marker.setMap(map);
      destination_marker.setMap(map);
  
      this.directionsDisplay.setMap(map);
      // this.directionsDisplay.setPanel(document.getElementById('directionsPanel')); //handle the textual display of directions as a series of steps
      // directionsDisplay.setOptions({ suppressMarkers: true });
      this.directionsDisplay.setOptions({
        polylineOptions: {
          strokeWeight: 2,
          // strokeOpacity: 1,
          strokeColor: 'black'
        },
        suppressMarkers: true
      });
      this.prevLat = this.riderLat();
      this.prevLng = this.riderLng();
      await this.changeDirectionRoute();
      map.setCenter(source_position);
      if(this.order?.status == 'Ongoing' || this.order?.status == 'Picked') {
        // // this.changeMarkerPosition(source_marker, map);      
        // this.changeMarkerPosition(rider_marker, map);       
        this.changeMarkerPosition(rider_marker); 
        this.changeDirectionRoute();
      } else this.ngOnDestroy();
      // this.interval = setInterval(async() => {        
      // }, 20000);
      this.renderer.addClass(mapEl, 'visible');
      // this.addMarker(location);
    } catch(e) {
      console.log(e);
    }
  }

  changeMarkerPosition(marker) {
    // const numDeltas = 100;
    let googleMaps: any = this.googleMaps;
    console.log('googlemaps2', this.order);
    const lat = parseFloat(this.riderLat());
    const lng = parseFloat(this.riderLng());
    // const deltaLat = (lat - this.prevLat)/numDeltas;
    // const deltaLng = (lng - this.prevLng)/numDeltas;
    const latlng = new googleMaps.LatLng(lat, lng);
    // map.setCenter(latlng);
    marker.setPosition(latlng);
    console.log("Updating runner position");
  }

  changeDirectionRoute() {    
    let source_lat = this.riderLat();
    let source_lng = this.riderLng();
    console.log('rider lat: ', source_lng);
    // let dest_lat = this.order?.status == 'Picked' ? this.order?.address?.lat : this.restLat();
    // let dest_lng = this.order?.status == 'Picked' ? this.order?.address?.lng : this.restLng();        
    let dest_lat = this.order?.address?.lat;
    let dest_lng = this.order?.address?.lng;
    const source = { lat: parseFloat(source_lat), lng: parseFloat(source_lng) };
    const destination = { lat: parseFloat(dest_lat), lng: parseFloat(dest_lng) };
    this.directionsService.route({
      origin: source,
      destination: destination,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        const directionsData = response.routes[0].legs[0];
        // const distance = directionsData.distance.text;
        const duration = directionsData.duration.text;
        this.duration.emit(duration);
      } else {
        this.global.errorToast('Directions request failed due to ' + status);
      }
    });  
  }

  restLat() {
    return this.order?.chef?.latitude ? this.order?.chef?.latitude : this.order?.chef?.coordinates?.latitude;
  }  

  restLng() {
    return this.order?.chef?.longitude ? this.order?.chef?.longitude : this.order?.chef?.coordinates?.longitude;
  }

  riderLat() {
    return this.order?.rider?.latitude ? this.order?.rider?.latitude : this.order?.rider?.coordinates?.latitude;
  }

  riderLng() {
    return this.order?.rider?.longitude ? this.order?.rider?.longitude : this.order?.rider?.coordinates?.longitude;
  }

  // haversine_distance(mk1, mk2) {
  //   const R = 3958.8; // Radius of the Earth in miles
  //   const rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
  //   const rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
  //   const difflat = rlat2-rlat1; // Radian difference (latitudes)
  //   const difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

  //   const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  //   return d; // in miles, multiply with 1.6 to get in kms
  // }

  ngOnDestroy() {
    // clearInterval(this.interval);
  }

}