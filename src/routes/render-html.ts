import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { utilService } from '../services/util-service';
const router = express.Router();

router.get(
  '/christian-gracia-spotify-player',
  (req: Request, res: Response) => {
    res
      .status(200)
      .send(
        `<div _ngcontent-serverapp-c58="" class="song-container"><app-current-song _nghost-serverapp-c61="" class="ng-star-inserted"><div _ngcontent-serverapp-c61="" class="flex flex-col justify-center song-container ng-star-inserted"><div _ngcontent-serverapp-c61="" class="song-row"><div _ngcontent-serverapp-c61="" class="song-left-col"><img _ngcontent-serverapp-c61="" height="36px" width="36px" alt="G Perico album image" src="https://i.scdn.co/image/ab67616d00001e02c09743453ed63d80d674f4d6"><div _ngcontent-serverapp-c61="" class="song-info-container"><span _ngcontent-serverapp-c61="" class="accent-color mat-caption song-name">Billie Jean </span><span _ngcontent-serverapp-c61="" class="mat-caption song-name">G Perico</span></div></div><div _ngcontent-serverapp-c61="" class="song-right-col"><mat-icon _ngcontent-serverapp-c61="" role="img" color="accent" class="mat-icon notranslate play-button clickable mat-accent material-icons ng-star-inserted" aria-hidden="true" data-mat-icon-type="font">play_circle_outline</mat-icon><mat-icon _ngcontent-serverapp-c61="" role="img" color="accent" class="mat-icon notranslate forward-button clickable mat-accent material-icons ng-star-inserted" aria-hidden="true" data-mat-icon-type="font">fast_forward</mat-icon></div></div><div _ngcontent-serverapp-c61="" class="song-progress-bar-container"><mat-progress-bar _ngcontent-serverapp-c61="" role="progressbar" aria-valuemin="00:00" aria-valuemax="30:00" tabindex="-1" color="accent" mode="determinate" class="mat-progress-bar song-progress-bar mat-accent" aria-valuenow="0"><div aria-hidden="true"><svg width="100%" height="4" focusable="false" class="mat-progress-bar-background mat-progress-bar-element"><defs><pattern x="4" y="0" width="8" height="4" patternUnits="userSpaceOnUse" id="mat-progress-bar-0"><circle cx="2" cy="2" r="2"></circle></pattern></defs><rect width="100%" height="100%" fill="url('/#mat-progress-bar-0')"></rect></svg><div class="mat-progress-bar-buffer mat-progress-bar-element"></div><div class="mat-progress-bar-primary mat-progress-bar-fill mat-progress-bar-element" style="transform: scale3d(0, 1, 1);"></div><div class="mat-progress-bar-secondary mat-progress-bar-fill mat-progress-bar-element"></div></div></mat-progress-bar><div _ngcontent-serverapp-c61="" class="song-progress-bar-text-container"><p _ngcontent-serverapp-c61="" class="song-progress-bar-text">00:00</p><p _ngcontent-serverapp-c61=""></p><p _ngcontent-serverapp-c61="" class="song-progress-bar-text">00:30</p></div></div><div _ngcontent-serverapp-c61="" class="current-text flex flex-row align-center mat-display-1"><app-lazy-animated-icon _ngcontent-serverapp-c61="" _nghost-serverapp-c60=""><div _ngcontent-serverapp-c60="" class="shockwave-container"><mat-icon _ngcontent-serverapp-c60="" role="img" color="accent" class="mat-icon notranslate spotify-image shock shock--shockwave is-active mat-accent material-icons" aria-hidden="true" data-mat-icon-type="font"> headphones </mat-icon></div></app-lazy-animated-icon><div _ngcontent-serverapp-c61="" class="mat-caption ng-star-inserted"> Last played at 8:52 PM 5/14/2022 </div></div></div></app-current-song>`,
      );
  },
);

router.get('/icons', async (req: Request, res: Response) => {
  const production = process.env.NODE_ENV === 'production' ? 'build/' : '';
  const cssCode = await utilService.readFile(
    `${production}src/assets/css/materialdesignicons.css`,
  );
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(cssCode);
  res.end();
});

module.exports = router;
