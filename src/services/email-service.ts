module.exports = {
  /**
   * Creates an html email as a string using passed in parameters
   * @param { string } name - Name of person who filled out form
   * @param { string } email - Email of person who filled out form
   * @param { number } message - Message from person who filled out form
   */
  createCgEmail: (name: string, email: string, message: string): string => {
    return `
  <!doctype html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
    </title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a{padding: 0;}
      			.ReadMsgBody{width: 100%;}
      			.ExternalClass{width: 100%;}
      			.ExternalClass *{line-height: 100%;}
      			body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
      			table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
      			img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
      			p{display: block; margin: 13px 0;}
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
      @media only screen and (max-width:480px) {
      			  		@-ms-viewport {width: 320px;}
      			  		@viewport {	width: 320px; }
      				}
    </style>
    <!--<![endif]-->
    <!--[if mso]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <!--[if lte mso 11]>
		<style type="text/css">
			.outlook-group-fix{width:100% !important;}
		</style>
		<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
      .dys-column-per-100 {
      	width: 100.000000% !important;
      	max-width: 100.000000%;
      }
      }
    </style>
  </head>
  <body>
    <div>
      <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#f7f7f7;background-color:#f7f7f7;width:100%;'>
        <tbody>
          <tr>
            <td>
              <div style='margin:0px auto;max-width:600px;'>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <div style='color:#4d4d4d;font-family:Oxygen, Helvetica neue, sans-serif;font-size:32px;font-weight:700;line-height:37px;text-align:center;'>
                                ${name} ${email}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;line-height:21px;text-align:center;'>
                                 ${message}
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]>
                        </td></tr></table>
                        <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  `;
  },
  /**
   * Creates an html email as a string using passed in parameters
   * @param { string } name - Name of person who filled out form
   * @param { string } phone - phone of person who filled out form
   * @param { number } message - Message from person who filled out form
   */
  createNflEmail: (name: string, phone: string, message: string): string => {
    return `
  <!doctype html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>
    </title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a{padding: 0;}
      			.ReadMsgBody{width: 100%;}
      			.ExternalClass{width: 100%;}
      			.ExternalClass *{line-height: 100%;}
      			body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
      			table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
      			img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
      			p{display: block; margin: 13px 0;}
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
      @media only screen and (max-width:480px) {
      			  		@-ms-viewport {width: 320px;}
      			  		@viewport {	width: 320px; }
      				}
    </style>
    <!--<![endif]-->
    <!--[if mso]>
		<xml>
			<o:OfficeDocumentSettings>
				<o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		<![endif]-->
    <!--[if lte mso 11]>
		<style type="text/css">
			.outlook-group-fix{width:100% !important;}
		</style>
		<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
      .dys-column-per-100 {
      	width: 100.000000% !important;
      	max-width: 100.000000%;
      }
      }
    </style>
  </head>
  <body>
    <div>
      <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#f7f7f7;background-color:#f7f7f7;width:100%;'>
        <tbody>
          <tr>
            <td>
              <div style='margin:0px auto;max-width:600px;'>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
                        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <div style='color:#4d4d4d;font-family:Oxygen, Helvetica neue, sans-serif;font-size:32px;font-weight:700;line-height:37px;text-align:center;'>
                                ${name} ${phone}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;line-height:21px;text-align:center;'>
                                 ${message}
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]>
                        </td></tr></table>
                        <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  `;
  },
};
