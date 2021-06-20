import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserModel} from '../../../../../model/UserModel';
import {ActivatedRoute} from '@angular/router';
import {SpreadService} from '../../../../../app/providers/spread/spread.service';
import {FileBlobModel} from '../../../../../model/FileBlobModel';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Subscription} from 'rxjs';
import {NotificationProvider} from '../../../../../app/providers/notification.provider';
import {SearchUserComponent} from '../../../../components/search-user/search-user.component';
import {MatDialog} from '@angular/material/dialog';
import {ParticipantEnum} from '../../../../../app/configuration/audience.enum';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit, AfterViewInit {
  private invitationHandler: any = {};
  private spreadId = 0;
  private _dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  private _displayedColumns: Array<string> = ['id', 'banned', 'firstname', 'picture', 'audience', 'time', 'accepted', 'action'];
  filterInvitation: FormControl = new FormControl('');
  constructor(private dialog: MatDialog, private notificationProvider: NotificationProvider, private activatedRoute: ActivatedRoute, private spreadService: SpreadService) { }

  ngOnInit() {
    this.spreadId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
    this.initTable();
  }


  private initTable () {
      this.invitationHandler = this.spreadService.fetchSpreadInvitations(this.spreadId, 1);
      this.invitationHandler.request().add(() => {
          this._dataSource = new MatTableDataSource<any>(this.invitationHandler.data);
          this._dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit(): void {
      const subscription = this.filterInvitation.valueChanges.subscribe(r => {
          this.applyFilter(this.filterInvitation.value);
      }).add(() => {
          subscription.unsubscribe();
      });
  }

    applyFilter(filterValue: string) {
        this._dataSource.filter = filterValue.trim().toLowerCase();
    }

    public addUser() {
        const searchUserModal = this.dialog.open(SearchUserComponent, {
            panelClass: 'search-user-modal',
            maxWidth: '500px'
        });

        const searchUser = searchUserModal.afterClosed().subscribe((r: UserModel) => {
            if (r) {
                const option: any = r;
                this.notificationProvider.inputSwal.options = {
                    input: 'select',
                    inputOptions: {
                         AUDIENCE: 'Audience',
                        CHIEF_HOST: 'Chief Host',
                        GUEST: 'Guest',
                        MANAGER: 'Manager'

                    },
                    title: 'Permission',
                    text: 'Please select a permission for the selected user',
                    type: 'question',
                    showConfirmButton: true,
                    confirmButtonText: 'Submit',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel'
                };

                this.notificationProvider.inputSwal.show().then(r => {
                    if (r) {
                        this.notificationProvider.inputSwal.options = {};
                        option.audienceType = r.value;
                        const subs = this.spreadService.requestAccessAutomatic(this.spreadId, option, false, true).add(() => {
                            this.initTable();
                        }).add(r => {
                            subs.unsubscribe();
                        });
                    }
                });

            }
        }).add(() => {
            searchUserModal.close();
            searchUser.unsubscribe();
        });
    }

  public ban(isBanned: boolean, userId: number, spreadId: number) {
      let subscription: Subscription;
      if (!isBanned) {
          this.notificationProvider.confirmSwal.options  = {
              title: 'Ban',
              text: 'Do you really want to ban the selected user?',
              confirmButtonText: 'Ban',
              showConfirmButton: true,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              type: 'question'
          };

          this.notificationProvider.confirmSwal.show();
          this.notificationProvider.confirmSwal.confirm.subscribe((r) => {
              if (r) {
                  subscription = this.spreadService.requestBan({
                      spread: spreadId,
                      user: userId
                  }).add(() => {
                      subscription.unsubscribe();
                  });
              }
          });

      } else {
          subscription = this.spreadService.requestBan({
              spread: spreadId,
              user: userId,
              cancel: true
          }).add(() => {
              subscription.unsubscribe();
              this.initTable();
          });
      }


  }



  public delete( invitation: number) {
     const subscription: Subscription =  this.spreadService.deleteInvitation(invitation).add(() => {
          this.initTable();
          subscription.unsubscribe();
      });
  }

  permission(permission) {
      if (permission === ParticipantEnum.CHIEF_HOST) {
          return 'Chief Host';
      } else if (permission === ParticipantEnum.GUEST) {
          return 'Guest';
      } else if (permission === ParticipantEnum.MANAGER) {
          return 'Manager';
      } else {
          return 'Audience';
      }
  }

  get loadingImg(): string {
    return FileBlobModel.loading();
  }

  get displayedColumns(): Array<string> {
    return this._displayedColumns;
  }


  get dataSource(): any {
    return this._dataSource;
  }
}
