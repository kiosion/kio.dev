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
fn index() -> status::Custom<content::RawJson<String>> {
    let res = json!({
        "error": {
            "code": 418,
            "message": "Do I look like a coffee machine to you?"
        }
    }).to_string();
    status::Custom(Status::ImATeapot, content::RawJson(res))
}

#[get("/post?<id>")]
async fn post(id: Option<String>) -> status::Custom<content::RawJson<String>> {
    let res: Value;
    // 'id' can be either UID of document or current URL slug
    // either way, it must be present
    if !id.as_ref().unwrap_or(&"".to_string()).trim().is_empty() {
        res = sanity::post(id.as_ref().unwrap().to_string()).await;
        let json = json!({
            "res": {
                "meta": {
                    "count": 1,
                    "ms": &res["ms"],
                    "params": {
                        "identifier": id.unwrap_or("".to_string())
                    },
                    "query": &res["query"]
                },
                "data": &res["result"]
            }
        }).to_string();
        status::Custom(Status::Ok, content::RawJson(json))
    } else {
        let json = json!({
            "error": {
                "code": 400,
                "message": "Invalid identifier provided"
            }
        }).to_string();
        status::Custom(Status::BadRequest, content::RawJson(json))
    }
}

#[get("/posts?<limit>&<skip>&<s>&<o>&<date>&<tags>")]
async fn posts(limit: Option<String>, skip: Option<String>, s: Option<String>, o: Option<String>, date: Option<String>, tags: Option<String>) -> status::Custom<content::RawJson<String>> {
    let res = sanity::posts().await;
    let json = json!({
        "res": {
            "meta": {
                "count": &res["result"].as_array().unwrap().len(),
                "total": 0, // need second query to Sanity to get total len.
                "ms": &res["ms"],
                "params": {
                    // these are temp, better to use generic func to parse for all routes.
                    "limit": limit.unwrap_or("10".to_string()),
                    "skip": skip.unwrap_or("0".to_string()),
                    "sort": s.unwrap_or("date".to_string()),
                    "order": o.unwrap_or("desc".to_string()),
                    "date": date.unwrap_or("".to_string()),
                    "tags": tags.unwrap_or("".to_string())
                },
                "query": &res["query"]
            },
            "data": &res["result"]
        }
    }).to_string();
    status::Custom(Status::Ok, content::RawJson(json))
}

#[catch(500)]
fn err_500() -> Value {
    json!({
        "error": {
            "code": 500,
            "message": "Internal server error"
        }
    })
}

#[catch(404)]
fn err_404() -> Value {
    json!({
        "error": {
            "code": 404,
            "message": "Requested route not found"
        }
    })
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    dotenv().ok();

    let _rocket = rocket::build()
        .mount("/", routes![index])
        .register("/", catchers![err_404, err_500])
        .mount("/query", routes![posts, post])
        .launch()
        .await?;

    Ok(())
}
