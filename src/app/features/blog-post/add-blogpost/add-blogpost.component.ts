import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit,OnDestroy {

  model: AddBlogPost;
  categories$?: Observable<Category[]>
  isImageSelectorVisible:boolean = false;
  imageSelectorSubscription?: Subscription;

  constructor(private blogPostServices: BlogPostService,
    private imageService: ImageService,
    private router: Router,
    private categoryService: CategoryService){
    this.model = {
      title:'',
      shortDescription:'',
      urlHandle:'',
      content:'',
      featuredImageUrl:'',
      author:'',
      isVisible:true,
      publishedate: new Date(),
      categories:[]
    }
  }
  
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectorSubscription = this.imageService.onSelectImage()
    .subscribe({
      next: (selectedImage) => {
        this.model.featuredImageUrl = selectedImage.url;
        this.closeImageSelector();
      }
    })
  }
  openImageSelector() {
    this.isImageSelectorVisible=true;
    }
    closeImageSelector() {
      this.isImageSelectorVisible=false;
      }

  onFormSubmit():void{
    this.blogPostServices.createBlogPost(this.model)
    .subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      } 
    });
  }
  ngOnDestroy(): void {
    this.imageSelectorSubscription?.unsubscribe();
  }

}
