package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Icecream struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Taste string `json:"taste"`
	Size  string `json:"size"`
	Price int    `json:"price"`
}
type Employee struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Position string `json:"position"`
}

var icecream = []Icecream{
	{ID: "1", Name: "Blizzard", Taste: "Oreo", Size: "S", Price: 49},
	{ID: "2", Name: "Icy Fruity", Taste: "Blue Rasberry", Size: "L", Price: 35},
	{ID: "3", Name: "Freezy Frappe", Taste: "Greentea", Size: "XL", Price: 70},
}
var employee = []Employee{
	{ID: "1", Name: "Jane", Phone: "080-xxx-xxxx", Position: "Casheir"},
	{ID: "2", Name: "Bow", Phone: "082-xxx-xxxx", Position: "Ice Cream Maker"},
}

func getIcecream(c *gin.Context) {
	IDQuery := c.Query("id")

	if IDQuery != "" {
		filter := []Icecream{}
		for _, Icecream := range icecream {
			if fmt.Sprint(Icecream.ID) == IDQuery {
				filter = append(filter, Icecream)
			}
		}
		c.JSON(http.StatusOK, filter)
		return

	}
	c.JSON(http.StatusOK, icecream)
}
func getEmployee(c *gin.Context) {
	IDQuery := c.Query("id")

	if IDQuery != "" {
		filter := []Employee{}
		for _, Employee := range employee {
			if fmt.Sprint(Employee.ID) == IDQuery {
				filter = append(filter, Employee)
			}
		}
		c.JSON(http.StatusOK, filter)
		return

	}
	c.JSON(http.StatusOK, employee)
}

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "healthy"})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/icecream", getIcecream)
		api.GET("/employee", getEmployee)
	}

	r.Run(":8080")
}
