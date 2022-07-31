extern crate sanity;

use sanity::SanityConfig;
use sanity::helpers::get_json;

use rocket::serde::json::Value;

use std::env;
use std::sync::{Mutex, Once};
use std::{mem::MaybeUninit};

struct SanityConfigReader {
    inner: Mutex<SanityConfig>,
}

fn setup_sanity() -> &'static SanityConfigReader {
    static mut SANITY_CONFIG: MaybeUninit<SanityConfigReader> = MaybeUninit::uninit();
    static ONCE: Once = Once::new();
    unsafe {
      ONCE.call_once(|| {
          // Make config
          let sn = SanityConfigReader {
              inner: Mutex::new(sanity::create(
                env::var("SANITY_PROJECT_ID").ok().unwrap().as_str(),
                "production",
                env::var("SANITY_TOKEN").ok().unwrap().as_str(),
                true,
              )),
          };
          // Store to static var
          SANITY_CONFIG.write(sn);
      });

      // Give out shared reference to the config (should be usable concurrently??)
      SANITY_CONFIG.assume_init_ref()
  }
}

pub async fn query(query: String) -> Result<Value, Box<dyn std::error::Error>> {
    let sn = setup_sanity();
    let res = sn.inner.lock().unwrap().get(&String::from(query));
    return get_json(res.unwrap())
}
