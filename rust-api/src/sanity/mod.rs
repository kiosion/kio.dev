mod client;

pub async fn posts() -> String {
    // not a real query, just a placeholder
    let res = client::query("*[_type == 'post']".to_string()).await;

    return res.unwrap().to_string();
}
