#[macro_use]extern crate rocket;
extern crate dotenv;
mod sanity;

use dotenv::dotenv;

use rocket::http::Status;
use rocket::response::status;
use rocket::response::content;
use rocket::serde::json::{Value, json};
use rocket::serde::{Serialize};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Error {
    message: String,
    code: i32
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Success {
    data: String
}

#[get("/")]
fn index() -> &'static str {
    "Cannot GET '/'"
}

#[get("/<query>")]
async fn posts(query: String) -> status::Custom<content::RawJson<String>> {
    let res: String;
    if query == "posts" {
        res = sanity::posts().await;
        status::Custom(Status::Accepted, content::RawJson(res))
    } else {
        res = "Cannot GET '/<query>'".to_string();
        status::Custom(Status::Unauthorized, content::RawJson(res))
    }
}

#[catch(500)]
fn err_500() -> Value {
    json!({
        "status": "error",
        "code": 500,
        "reason": "Internal server error"
    })
}

#[catch(404)]
fn err_404() -> Value {
    json!({
        "status": "error",
        "code": 404,
        "reason": "Resource was not found"
    })
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    dotenv().ok();

    let _rocket = rocket::build()
        .mount("/", routes![index])
        .register("/", catchers![err_404, err_500])
        .mount("/query", routes![posts])
        .launch()
        .await?;

    Ok(())
}
