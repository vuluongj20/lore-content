import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../data.service';
import { FormService } from '../form.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: [
    './edit-team.component.css',
    '../global.css'
  ]
})
export class EditTeamComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer
  ) { }

  mems: any;
  newMem: any = {};
  edits: any;
  sectionOnEdit: boolean = false;
  files: any = [];
  newMemFile: any = [];
  memGroup = this.fb.group({
    array: this.fb.array([])
  });
  newMemGroup = this.fb.group({
    name: ['', Validators.required],
    function: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
    link: [''],
    cleanUrl: [],
    size: ['1000'],
    x: ['500'],
    y: ['500'],
  });
  onTouchStart($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.add('touch');
  }
  onTouchEnd($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.remove('touch');
  }
  editSection($event) {
    this.formService.editSection($event);
    this.sectionOnEdit = true;
  }
  doneEditSection($event) {
    this.memGroup = this.fb.group({
      array: this.fb.array([])
    });
    for (var x = 0; x < this.mems.length; x++) {
      (<FormArray>this.memGroup.get('array')).push(
        this.fb.group({
          name: [this.mems[x].name, Validators.required],
          function: [this.mems[x].function, Validators.required],
          email: [this.mems[x].email, [
            Validators.required,
            Validators.email
          ]],
          color: [this.mems[x].color, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
          link: [this.mems[x].link],
          cleanUrl: [this.mems[x].cleanUrl],
          size: [this.mems[x].size],
          x: [this.mems[x].x],
          y: [this.mems[x].y]
        })
      );
    }
    this.formService.doneEditSection($event);
    this.sectionOnEdit = false;
  }
  cancelEditSection($event) {
    this.mems = this.memGroup.get('array').value;
    this.sectionOnEdit = false;
    this.formService.doneEditSection($event);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mems, event.previousIndex, event.currentIndex);
  }
  delete(i) {
    this.mems.splice(i, 1);
  }
  expand($event) {
    this.formService.expand($event);
    this.formService.formOpenCounter();
  }
  onFileChange($event, i) {
    if ($event.target.files && $event.target.files.length) {
      var file = $event.target.files[0];
      var url = URL.createObjectURL(file);
      this.files[i].push({current: false, file: file});
      this.mems[i].cleanUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
      this.mems[i].link = file.name;
    }
  }
  cancel($event, i) {
    $event.stopPropagation();
    for (let x of Object.keys(this.mems[i])) {
      if (x !== 'cleanUrl' && x !== 'link') {
        (<FormArray>this.memGroup.get('array')).at(i).get(x).patchValue(this.mems[i][x]);
      }
    }
    this.mems[i].cleanUrl = this.memGroup.get('array').value[i].cleanUrl;
    this.mems[i].link = this.memGroup.get('array').value[i].link;
    if (this.files[i].length !== 0) {
      if (this.files[i][0].current) {
        this.files[i].splice(1, this.files[i].length -1);
      } else {
        this.files[i] = [];
      }
    }
    $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
    this.formService.collapse($event);
    this.formService.formCloseCounter();
  }
  onSubmit($event, i) {
    $event.stopPropagation();
    if ((<FormArray>this.memGroup.get('array')).at(i).valid) {
      var cleanUrl = this.mems[i].cleanUrl;
      var link = this.mems[i].link;
      for (let x of Object.keys(this.memGroup.get('array').value[i])) {
        if (x !== 'cleanUrl') {
          this.mems[i][x] = this.memGroup.get('array').value[i][x];
        }
      }
      this.mems[i].link = link;
      (<FormArray>this.memGroup.get('array')).at(i).get('cleanUrl').patchValue(cleanUrl);
      (<FormArray>this.memGroup.get('array')).at(i).get('link').patchValue(link);
      if (this.files[i].length !== 0) {
        this.files[i].splice(0, this.files[i].length - 1);
        this.files[i][0].current = true;
      }
      this.formService.collapse($event);
      this.formService.formCloseCounter();
    }
  }
  newExpand($event) {
    this.formService.expand($event);
    this.formService.formOpenCounter();
  }
  newOnFileChange($event) {
    if ($event.target.files && $event.target.files.length) {
      var file = $event.target.files[0];
      var url = URL.createObjectURL(file);
      this.newMemFile.push({current: false, file: file});
      this.newMem.cleanUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
      this.newMem.link = file.name;
    }
  }
  newCancel($event) {
    $event.stopPropagation();
    this.newMemGroup = this.fb.group({
      name: ['', Validators.required],
      function: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
      link: [''],
      cleanUrl: [],
      size: ['1000'],
      x: ['500'],
      y: ['500'],
    });
    this.newMemFile = [];
    this.newMem = {};
    $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
    this.formService.collapse($event);
    this.formService.formCloseCounter();
  }
  newOnSubmit($event) {
    $event.stopPropagation();
    if (this.newMemGroup.valid) {
      if (this.newMemGroup.value.name.trim() !== '' || this.newMemGroup.value.function.trim() !== '' || this.newMemGroup.value.email.trim() !== '') {
        (<FormArray>this.memGroup.get('array')).push(this.fb.group({
          name: [this.newMemGroup.value.name, Validators.required],
          function: [this.newMemGroup.value.function, Validators.required],
          email: [this.newMemGroup.value.email, [
            Validators.required,
            Validators.email
          ]],
          color: [this.newMemGroup.value.color, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
          link: [this.newMem.link],
          cleanUrl: [this.newMem.cleanUrl],
          size: [this.newMemGroup.value.size],
          x: [this.newMemGroup.value.x],
          y: [this.newMemGroup.value.y],
        }));
        this.mems.push((<FormArray>this.memGroup.get('array')).at((<FormArray>this.memGroup.get('array')).length - 1).value);
        if (this.newMemFile.length !== 0) {
          this.newMemFile[this.newMemFile.length - 1].current = true;
          this.files.push([this.newMemFile[this.newMemFile.length - 1]]);
        }
        this.formService.collapse($event);
        this.formService.formCloseCounter();
      }
      this.newMemGroup = this.fb.group({
        name: ['', Validators.required],
        function: ['', Validators.required],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
        link: [''],
        cleanUrl: [],
        size: ['1000'],
        x: ['500'],
        y: ['500'],
      });
      this.newMemFile = [];
      this.newMem = {};
      $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
    }
  }
  ngOnInit() {
    this.dataService.getData('main/team').subscribe(
      data => {
        this.mems = data;
        for (let x = 0; x < this.mems.length; x++) {
          this.files[x] = [];
          (<FormArray>this.memGroup.get('array')).push(
            this.fb.group({
              name: [this.mems[x].name, Validators.required],
              function: [this.mems[x].function, Validators.required],
              email: [this.mems[x].email, [
                Validators.required,
                Validators.email
              ]],
              color: [this.mems[x].color, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
              link: [this.mems[x].link],
              cleanUrl: [],
              size: [this.mems[x].size],
              x: [this.mems[x].x],
              y: [this.mems[x].y]
            })
          );
          this.dataService.getFile(this.mems[x].link).subscribe(
            data => {
              var url = URL.createObjectURL(data);
              var sanitizedUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
              this.mems[x].cleanUrl = sanitizedUrl;
              (<FormArray>this.memGroup.get('array')).at(x).get('cleanUrl').patchValue(sanitizedUrl);
          })
        }
      }
    );
  }

}
