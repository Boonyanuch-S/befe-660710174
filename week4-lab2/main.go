package main

import (
	"fmt"
)
// var email string = "Srijanchay_b@su.ac.th"

func main() {
	// var name string = "Boonyanuch"
	var age int = 20

	email := "Srijanchay_b@su.ac.th"
	gpa := 2.80

	firstname, lastname := "Boonyanuch", "Srijanchay"

	fmt.Printf("Name %s %s, age %d, email %s, gpa %.2f\n", firstname, lastname, age, email, gpa)

}