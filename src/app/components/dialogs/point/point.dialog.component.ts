import { NbDialogRef } from '@nebular/theme';
import { AgmMarker, MapsAPILoader } from '@agm/core';
import { Component, Input, Output, ViewChild, ElementRef, NgZone } from '@angular/core';


@Component({
	selector: 'point-dialog',
	styleUrls: ['point.dialog.component.scss'],
	templateUrl: 'point.dialog.component.html'
})
export class PointDialogComponent {
	@ViewChild('search', {static: true}) autoComplete: ElementRef;

	@Input() location: string;
	@Input() locations: google.maps.places.PlaceResult[] = [];
	@Input() selectedLocation: google.maps.places.PlaceResult;

	placedMarker: any;

	constructor(protected maps: MapsAPILoader, protected zone: NgZone, protected dialogRef: NbDialogRef<PointDialogComponent>) {}

	searchForLocation() {
		this.maps.load().then(() => {
			let auto = new google.maps.places.Autocomplete(this.autoComplete.nativeElement);

			auto.addListener('place_changed', () => {
				this.zone.run(() => {
					this.selectedLocation = auto.getPlace();
				})
			});
		});
	}

	selectPlace(place: google.maps.places.PlaceResult) {
		this.selectedLocation = place;
	}

	placeMarker(ev: any): void {
		this.placedMarker = {
			id: ev.id,
			latitude: ev.coords.lat,
			longitude: ev.coords.long
		};
	}

	removeMarker(ev: AgmMarker): void {
		this.placedMarker = {};
	}

	submit(ev: Event) {
		this.dialogRef.close(this.placedMarker); 
	}

	close(ev?: Event) {
		this.dialogRef.close();
	}

}