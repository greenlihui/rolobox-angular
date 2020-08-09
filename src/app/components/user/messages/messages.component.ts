import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FriendRequestDialogComponent } from '../../../popups/friend-request-dialog/friend-request-dialog.component';
import { User } from '../../../models/user';
import { FriendshipService } from '../../../services/friendship.service';
import { ImageService } from '../../../services/image.service';
import { DeleteDialogComponent } from '../../../popups/delete-dialog/delete-dialog.component';
import { MessageService } from '../../../services/message.service';
import { StateService } from '../../../services/state.service';
import { Message } from '../../../models/message';
import { forkJoin } from 'rxjs';
import { QrCodeDialogComponent } from '../../../popups/qrcode-dialog/qr-code-dialog.component';

enum PanelContent {
  FRIENDS,
  FRIEND_DETAIL
}

enum MessageType {
  TEXT = 'TEXT',
  CONTACT = 'CONTACT',
  IMAGE = 'IMAGE'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChild('conversations', {static: false}) conversations: ElementRef<HTMLDivElement>;
  endPanelOpened = false;
  endPanelContentOptions = PanelContent;
  endPanelContent: PanelContent = this.endPanelContentOptions.FRIENDS;

  friends: User[];

  currentFriendInChatting: User;
  friendsInConversation: User[] = [];
  latestMsgData: {latestMsg?: Message, unreadCount?: number}[] = [];

  dataAvailable = false;

  msgInput = '';
  messages: Message[];
  messageTypes = MessageType;
  currentFriendInDisplay: User;

  emptyFriend = {
    _id: 'whatever',
    profile: {
      name: {
        full: 'Choose a Friend To Chat'
      }
    }
  };

  constructor(private _dialog: MatDialog,
              private _snackbar: MatSnackBar,
              private msgService: MessageService,
              private stateService: StateService,
              private fsService: FriendshipService,
              private imageService: ImageService) {
    this.initFriends();
    this.initFriendsInConversation();
    this.msgService.receiveMsg().subscribe(msg => {
      if (msg.sender === this.currentFriendInChatting._id) {
        this.messages.push(msg);
        this.scrollToBottom();
        this.msgService.setMsgRead(msg._id).subscribe(_ => {
          this.initFriendsInConversation();
        });
      } else if (msg.sender === this.stateService.currentUser._id) {
        this.messages.push(msg);
        this.initFriendsInConversation();
        this.scrollToBottom();
      } else {
        this.initFriendsInConversation();
      }
    });
  }

  scrollToBottom() {
    this.conversations.nativeElement.scrollTop = 10000000;
  }

  ngOnInit() {
    this.currentFriendInChatting = this.emptyFriend;
  }

  initFriendsInConversation() {
    this.msgService.getFriendsInConversation().subscribe(res => {
      forkJoin(
        res.data
        .map(f => f._id)
        .map(id => this.msgService.getLatestMsgData(id))
      ).subscribe(res2 => {
        this.friendsInConversation = res.data;
        this.latestMsgData = res2;
        this.dataAvailable = true;
      });
    });
  }

  setCurrentFriendInChatting(friend: User) {
    this.currentFriendInChatting = friend;
    this.msgService.setAllMsgsRead(friend._id).subscribe(_ => {
      this.initFriendsInConversation();
    });
    this.initMessages();
  }

  initMessages() {
    this.msgService.getMessages(this.currentFriendInChatting._id).subscribe(res => {
      this.messages = res.data;
      this.scrollToBottom();
    });
  }

  sendMsg(type: MessageType, content) {
    const msg = {
      sender: this.stateService.currentUser._id,
      receiver: this.currentFriendInChatting._id,
      type: type,
      content: content,
      unread: true
    };
    this.msgService.sendMsg(msg);
    this.msgInput = '';
  }

  formatMsgContent(content: string) {
    return (content.length < 24) ? content : content.substr(0, 24) + '...';
  }

  isReceive(msg: Message) {
    return msg.sender === this.currentFriendInChatting._id;
  }

  avatarUrl(msg: Message) {
    if (this.isReceive(msg)) {
      return this.imageService.generateThumbnailImageURL(this.currentFriendInChatting.profile.faces.avatar);
    } else {
      return this.imageService.generateThumbnailImageURL(this.stateService.currentUser.profile.faces.avatar);
    }
  }

  formatMsgTime(time) {
    const today = (new Date(Date.now())).toLocaleDateString();
    const msgDate = (new Date(time)).toLocaleDateString();
    if (today !== msgDate) {
      return msgDate;
    } else {
      return (new Date(time)).toLocaleTimeString();
    }
  }

  startChatting(user: User) {
    if (this.friendsInConversation.some(f => f._id === user._id)) {
      this.setCurrentFriendInChatting(user);
    } else {
      this.setCurrentFriendInChatting(user);
      this.friendsInConversation.unshift(user);
      this.latestMsgData.unshift({
        latestMsg: {
          content: '',
          timestamp: null,
        },
        unreadCount: 0
      });
    }
    // this.closeEndPanel();
  }

  initFriends() {
    this.fsService.getFriends().subscribe(res => {
      this.friends = res.data;
    });
  }

  openFriendRequestDialog() {
    const friendRequestDialog = this._dialog.open(FriendRequestDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      restoreFocus: false,
      width: '416px',
    });
    friendRequestDialog.afterClosed().subscribe(_ => {
      this.initFriends();
    });
  }

  openQrCodeDialog() {
    this._dialog.open(QrCodeDialogComponent, {
      hasBackdrop: true,
      disableClose: false,
      restoreFocus: false,
      width: '416px'
    });
  }

  openFriendDetail(friend: User) {
    this.changePanelContent(this.endPanelContentOptions.FRIEND_DETAIL);
    this.currentFriendInDisplay = friend;
  }

  openDeleteFriendDialog(friendUserId) {
    const deleteFriendDialog = this._dialog.open(DeleteDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '32%',
      data: 'Delete this friend will also delete information related to him/her,' +
        'including your conversations with him/her.'
    });
    deleteFriendDialog.afterClosed().subscribe(res => {
      if (res) {
        this.fsService.deleteFriend(friendUserId).subscribe(_ => {
          this._snackbar.open('successfully deleted', null, {
            duration: 2000
          });
        });
        this.initFriends();
        this.initFriendsInConversation();
        this.messages = [];
        this.currentFriendInChatting = this.emptyFriend;
        this.changePanelContent(this.endPanelContentOptions.FRIENDS);
      }
    });
  }

  openBlockFriendDialog(friendUserId) {
    const blockFriendDialog = this._dialog.open(DeleteDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      width: '32%',
      data: 'Block this friend will delete information related to him/her,' +
        'including your conversations with him/her, and you will never receive ' +
        'any notifications from him/her. Go to settings page to unblock.'
    });
    blockFriendDialog.afterClosed().subscribe(res => {
      if (res) {
        this.fsService.blockUser(friendUserId).subscribe(_ => {
          this._snackbar.open('User has been blocked', null, {
            duration: 2000
          });
          this.initFriends();
          this.changePanelContent(this.endPanelContentOptions.FRIENDS);
        });
      }
    });
  }

  changePanelContent(content: PanelContent) {
    this.openEndPanel();
    this.endPanelContent = content;
  }

  isEndPanelContent(content: PanelContent) {
    return this.endPanelContent === content;
  }

  openEndPanel() {
    this.endPanelOpened = true;
  }

  closeEndPanel() {
    this.endPanelOpened = false;
  }

}
