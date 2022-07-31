extern crate sanity;
use sanity::helpers::get_json;

fn main(query: String) -> String {
  let mut sn = sanity::create(
    "proj_id",
    "production",
    "token",
    true,
  );
  let res = sn.get(&String::from(query));
  if res.is_ok() {
    let data = res.unwrap();
    return get_json(&data);
  }
}
