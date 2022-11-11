pub enum OutType {
    Console,
}

pub struct Body {
    pub stree: String,
    pub out_type: OutType,
}
impl Body {
    pub fn from(text: &str) -> Result<Self, String> {
        let text = String::from(text) + ",";
        let mut stree_opt = None;
        let mut out_type_opt = None;
        let mut buf = String::new();
        let mut key = String::new();
        let mut is_in_literal = false;
        for c in text.chars() {
            match c {
                '"' => is_in_literal = !is_in_literal,
                ':' if !is_in_literal => {
                    key = buf.clone();
                    buf.clear();
                }
                ',' if !is_in_literal => {
                    if key == "stree" {
                        stree_opt = Some(buf.clone());
                    } else if key == "out_type" {
                        if buf == "console" {
                            out_type_opt = Some(OutType::Console);
                        } else {
                            return Err(format!(
                                "pyramid backend error: invalid 'type_out' value '{}'.",
                                buf
                            ));
                        }
                    } else {
                        return Err(format!("pyramid background error: invalid key '{}'.", buf));
                    }
                    key.clear();
                    buf.clear();
                }
                c if is_in_literal => buf.push(c),
                _ => (),
            }
        }
        let stree = stree_opt.ok_or(String::from(
            "pyramid backend error: the key 'stree' not found.",
        ))?;
        let out_type = out_type_opt.ok_or(String::from(
            "pyramid backend error: the key 'stree' not found.",
        ))?;
        Ok(Self { stree, out_type })
    }
}

pub fn format_output_json(res: String) -> String {
    format!("{{\"result\":\"{}\"}}", res)
}
