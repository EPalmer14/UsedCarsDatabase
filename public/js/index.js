function get_car_block(car, idx) {
    return `<div class="car_block ${idx % 2 === 0 ? 'even_row' : 'odd_row'}">
                <div class="row">
                    <div class="col-3" id="make">${car.make}</div>
                    <div class="col-3" id="model">${car.model}</div>
                    <div class="col-3" id="year">${car.year}</div>
                    <div class="col-1" id="price">${car.price}</div>
                    <div class="col-2 d-flex justify-content-end">
                        <button class="btn btn-outline-primary buttonDiv" value="${car.stock_num}">
                        Like</button>
                    </div>
                </div>
            </div>`
}


function showList(cars) {
    $('#car_list').empty();

    cars.forEach((car, idx) => {
        console.log(car, idx)
        $('#car_list')
            .append(get_car_block(car, idx))
    })
}

let cars = [
    {
        "stock_num": "19913071",
        "make": "Toyota",
        "model": "Corolla",
        "year": 2015,
        "color": "Red",
        "url": "https://img2.carmax.com/img/vehicles/19913071/1.jpg?width=800",
        "price": 14715
    },
    {
        "stock_num": "20319754",
        "make": "Hyundai",
        "model": "Sonata",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20319754/1.jpg?width=800",
        "price": 14102
    },
    {
        "stock_num": "20322507",
        "make": "Kia",
        "model": "Optima",
        "year": 2018,
        "color": "Gray",
        "url": "https://img2.carmax.com/img/vehicles/20322507/1.jpg?width=800",
        "price": 2644
    },
    {
        "stock_num": "20322520",
        "make": "Kia",
        "model": "Optima",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20322520/1.jpg?width=800",
        "price": 11016
    },
    {
        "stock_num": "20196030",
        "make": "Nissan",
        "model": "Sentra",
        "year": 2019,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/20196030/1.jpg?width=800",
        "price": 7377
    },
    {
        "stock_num": "20196050",
        "make": "Nissan",
        "model": "Sentra",
        "year": 2019,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20196050/1.jpg?width=800",
        "price": 6988
    },
    {
        "stock_num": "19662328",
        "make": "Mazda",
        "model": "Mazda3",
        "year": 2016,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19662328/1.jpg?width=800",
        "price": 7497
    },
    {
        "stock_num": "19913278",
        "make": "Ford",
        "model": "Taurus",
        "year": 2017,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19913278/1.jpg?width=800",
        "price": 12478
    },
    {
        "stock_num": "19912988",
        "make": "Chevrolet",
        "model": "Malibu",
        "year": 2016,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19912988/1.jpg?width=800",
        "price": 10529
    },
    {
        "stock_num": "20214390",
        "make": "Toyota",
        "model": "Camry",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20214390/1.jpg?width=800",
        "price": 14538
    },
    {
        "stock_num": "19912880",
        "make": "Toyota",
        "model": "Corolla",
        "year": 2016,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/19912880/1.jpg?width=800",
        "price": 9314
    },
    {
        "stock_num": "19912965",
        "make": "Honda",
        "model": "Accord",
        "year": 2020,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/19912965/1.jpg?width=800",
        "price": 9769
    },
    {
        "stock_num": "19662236",
        "make": "Honda",
        "model": "Civic",
        "year": 2015,
        "color": "Silver",
        "url": "https://img2.carmax.com/img/vehicles/19662236/1.jpg?width=800",
        "price": 4589
    },
    {
        "stock_num": "19913309",
        "make": "Dodge",
        "model": "Dart",
        "year": 2013,
        "color": "Silver",
        "url": "https://img2.carmax.com/img/vehicles/19913309/1.jpg?width=800",
        "price": 13095
    }
];

showList(cars);

$(document).ready(() => {
    $.getJSON('/get_current_user').done((data) => {
        if (data.message === "success") {
            const user = data.data;
            $('.login').remove();
            $('#showname').text(user.fullname)
        } else {
            $('.logout').remove();
        }
    })
})

$('.buttonDiv').on('click', function () {
    let car_num = $(this).val();
    let car_data = {};
    for (let i = 0; i < cars.length; i++) {
        if (cars[i].stock_num === car_num) {
            car_data = cars[i];
            break
        }
    }
    $.post('/like_car', {car: car_data}).done((data) => {
        if (data.message === "success") {
            location.reload();
        } else {
            location.href = data.redr;
        }
    });
});