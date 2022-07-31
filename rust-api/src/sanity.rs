pub async fn posts() -> String {
    // garbo random data for now
    std::thread::sleep(std::time::Duration::from_secs(1));
    r#"meta: {
  length: 1,
  filter: ""
},
data: [
  {
    "title": "Hello, world!",
    "body": "This is a test post."
  }
]"#.to_string()
}
