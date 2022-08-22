use rocket::serde::json::Value;
use regex::Regex;
use urlencoding::encode;

mod client;

fn re(str: &str) -> String {
    Regex::new(r"\s+").unwrap().replace_all(str, " ").to_string()
}

pub async fn post(id: String) -> Value {
    let mut query = format!("*[!(_id in path('drafts.**')) && _type == 'post' && (slug.current == '{}' || _id == '{}')]{{
        _id,
        _type,
        'author': {{
          '_id': author->_id,
          '_type': author->_type,
          'name': author->name,
          'slug': author->slug
        }},
        body,
        desc,
        date,
        tags[]->{{
          _id,
          title,
          slug
        }},
        slug,
        title
      }}[0]", id, id);
    query = re(&query);
    let res = client::query(encode(&query).to_string()).await;

    res.unwrap()
}

pub async fn posts() -> Value {
    // Not a real query, just a placeholder
    let mut query: String = "*[!(_id in path('drafts.**')) && _type == 'post']{{
        _id,
        _type,
        'author': {{
          '_id': author->_id,
          '_type': author->_type,
          'name': author->name,
          'slug': author->slug
        }},
        body,
        desc,
        date,
        tags[]->{{
          _id,
          title,
          slug
        }},
        slug,
        title
      }}".to_string();
    query = re(&query);
    let res = client::query(encode(&query).to_string()).await;

    res.unwrap()
}
