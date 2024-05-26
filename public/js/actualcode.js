var options = {
	id: "myStaff",
	clef: "treble",
	accidental: "flat",
	color: "#FF0000",
	scroll: false,
}

// create a new staff
var myStaff = new Staff(options)

myStaff.setClef('treble');

myStaff.setNote([45,55,62]);
