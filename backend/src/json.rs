pub enum OutType {
    Console,
}

pub struct Body {
    pub defines: Vec<String>,
    pub stree: String,
    pub out_type: OutType,
}
impl Body {
    pub fn from(text: &str) -> Result<Self, String> {
        let text = String::from(text) + ",";
        let mut defines_opt = None;
        let mut stree_opt = None;
        let mut out_type_opt = None;
        let mut array = Vec::new();
        let mut buf = String::new();
        let mut key = String::new();
        let mut is_in_literal = false;
        let mut is_in_array = false;
        for c in text.chars() {
            match c {
                '"' => is_in_literal = !is_in_literal,
                '[' => {
                    if !is_in_array {
                        is_in_array = true;
                    } else {
                        return Err(String::from("pyramid midend error: '[' found in array."));
                    }
                }
                ']' => {
                    if is_in_array {
                        is_in_array = false;
                    } else {
                        return Err(String::from(
                            "pyramid midend error: ']' found out of array.",
                        ));
                    }
                }
                ':' if !is_in_literal => {
                    key = buf.clone();
                    buf.clear();
                }
                ',' if !is_in_literal => {
                    if is_in_array {
                        array.push(buf.clone());
                        buf.clear();
                    } else {
                        if key == "defines" {
                            if buf != "" {
                                array.push(buf.clone());
                            }
                            defines_opt = Some(array.clone());
                            array.clear();
                        } else if key == "stree" {
                            stree_opt = Some(buf.clone());
                        } else if key == "out_type" {
                            if buf == "console" {
                                out_type_opt = Some(OutType::Console);
                            } else {
                                return Err(format!(
                                    "pyramid midend error: invalid 'type_out' value '{}'.",
                                    buf
                                ));
                            }
                        } else {
                            return Err(format!("pyramid midend error: invalid key '{}'.", buf));
                        }
                        key.clear();
                        buf.clear();
                    }
                }
                c if is_in_literal => buf.push(c),
                _ => (),
            }
        }
        let defines = defines_opt.ok_or(String::from(
            "pyramid midend error: the key 'defines' not found.",
        ))?;
        let stree = stree_opt.ok_or(String::from(
            "pyramid midend error: the key 'stree' not found.",
        ))?;
        let out_type = out_type_opt.ok_or(String::from(
            "pyramid midend error: the key 'stree' not found.",
        ))?;
        Ok(Self {
            defines,
            stree,
            out_type,
        })
    }
}

pub fn format_output_json(res: String) -> String {
    format!("{{\"result\":\"{}\"}}", res)
}
