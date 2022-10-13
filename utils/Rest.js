'use strict';

export function SendSuccessToken (res, token, user) {
    if(!res) {
        return;
    }

    let out = {};

    out.token = token;
    out.id = user._id;
    out.LoginName = user.LoginName;
    out.UserName = user.UserName;

    res.status(200);
    res.contentType('json');
    return res.json(out);

}

export function SendError (res, code, mess, httpCode, description, error) {
    if (!res) {
        return;
    }

    let output = {};
    output.code = code;
    output.mess = mess ? mess.toString() : "Unidentified error";

    if(description) {
        output.description = description.toString();
    }
    else if (error) {
        output.error = error;
    }

    console.log(output);
    let status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(output);
}