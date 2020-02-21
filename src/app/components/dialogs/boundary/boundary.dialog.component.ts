import { NbDialogRef } from '@nebular/theme';
import { AgmMarker, MapsAPILoader } from '@agm/core';
import { Component, Input, Output, ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
	selector: 'boundary-dialog',
	styleUrls: ['boundary.dialog.component.scss'],
	templateUrl: './boundary.dialog.component.html'
})
export class BoundaryDialogComponent {
	@ViewChild('search', {static: true}) autoComplete: ElementRef;

	@Input() location: string;
	@Input() locations: google.maps.places.PlaceResult[] = [];
	@Input() selectedLocation: google.maps.places.PlaceResult;
	@Input() model: any[] = [];

	constructor(protected maps: MapsAPILoader, protected zone: NgZone, protected dialogRef: NbDialogRef<BoundaryDialogComponent>) {}

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
		this.model.push({
			// id: ev.id,
			latitude: ev.coords.lat,
			longitude: ev.coords.long
		});
	}

	removeMarker(ev: AgmMarker): void {
		this.model.map((m: any) => {
			if(m.id !== ev.id()) {
				return m;
			}
		});
	}

	submit(ev: Event) {
		this.dialogRef.close(this.model); 
	}

	close(ev?: Event) {
		this.dialogRef.close();
	}

}