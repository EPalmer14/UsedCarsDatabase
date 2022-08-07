$(document).ready(() => {
    $.getJSON('/get_current_user').done((data) => {
        if(data.message === "success") {
            const user = data.data;
            load_user(user);
        }else{
            console.log("error");
        }
    })
})

function load_user(user) {
    $('#name').text(user.fullname);
    $('#brand').text(user.brand);
    $('#profile_img').attr('src', user.profile);

    if(user.likes){
        const cars = [];
        user.likes.forEach((car) => {
            cars.push(JSON.stringify(car));
        });
        for(let i = 0; i < cars.length; i++){
            let obj = JSON.parse(cars[i]);
            let exp = `<li style="border: 1px solid lightgrey;"> 
                            <p style="padding-left: 3%;"> ${obj.year}  ${obj.make} ${obj.model}, ${obj.color}, $${obj.price}</p>
                    </li>`;
            $('#car_list').append(exp);
        }
    }
}