$("#add_comic").submit(function (event) {
  alert("Data Inserted Successfully!");
});

// need function to keep track of this
$("#update_comic").submit(function (event) {
  event.preventDefault();

  let unindexed_array = $(this).serializeArray();

  const data = {};
  $.map(unindexed_array, function (n, index) {
    data[n["name"]] = n["value"];
  });
  console.log(data);

  const request = {
    url: `https://comic-labs.herokuapp.com/api/v1/marvelcomics/${data.id}`,
    method: "PUT",
    data: data,
  };

  $.ajax(request).done((res) => {
    alert("Data Updated Successfully!");
  });
});

if (window.location.pathname == "/comics") {
  $ondelete = $(".card .theback a.delete ");
  $ondelete.click(function () {
    let id = $(this).attr("data-id");
    console.log(id);

    const request = {
      url: `https://comic-labs.herokuapp.com/api/v1/marvelcomics/${id}`,
      method: "DELETE",
    };

    if (confirm("Do you really wat to delete this comic")) {
      $.ajax(request).done((res) => {
        alert("Data Deleted Successfully!");
        location.reload();
      });
    }
  });
}
