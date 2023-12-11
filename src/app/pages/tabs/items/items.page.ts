import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonModal, IonicModule } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { CartService } from "src/app/services/cart/cart.service";
import { GlobalService } from "src/app/services/global/global.service";
import { Cart } from "src/app/interfaces/cart.interface";

import { CategoryService } from "src/app/services/category/category.service";
import { MenuService } from "src/app/services/menu/menu.service";
import { EmptyScreenComponent } from "src/app/components/empty-screen/empty-screen.component";

import { ItemComponent } from "src/app/components/item/item.component";

import { Item } from "src/app/interfaces/item.interface";
import { IonicSlides } from "@ionic/angular";
import { DatePipe } from "@angular/common";
import { Category } from "src/app/interfaces/category.interface";
import { LoadingItemComponent } from "src/app/components/loading-item/loading-item.component";
import { HttpService } from "src/app/services/http/http.service";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.page.html",
  styleUrls: ["./items.page.scss"],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EmptyScreenComponent,
    ItemComponent,
    LoadingItemComponent,
  ],
  providers: [DatePipe],
})
export class ItemsPage implements OnInit, OnDestroy {
  @ViewChild("item_search_modal") searchModal: IonModal;
  @ViewChild("searchItemInput") sInput;
  id: any;
  data = {} as any;
  items: any[] = [];
  veg: boolean = false;
  nonVeg: boolean = false;
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: "fast-food-outline",
    title: "No Menu Available",
    noSpace: true,
  };
  searchModel = {
    icon: "fast-food-outline",
    title: "Sorry! No such dishes found",
    noSpace: true,
  };
  categories: any[] = [];
  allItems: any[] = [];
  cartSub: Subscription;
  itemSearch = false;
  query: string;
  searchItems: any[] = [];
  delivery_dates: any[];

  public selectedCard: any = "";
  public selectedDate: any;
  public daysArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  swiperModules = [IonicSlides];
  public selectedCategoryId: any = 0;
  public previousDate: any;
  chef: any;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private authService: AuthService,
    private httpService: HttpService,
    private cartService: CartService,
    private global: GlobalService,
    private menuService: MenuService,
    private categoryService: CategoryService
  ) {
    this.httpService.get("chef/" + this.id).subscribe((data: any) => {
      this.chef = data.data;
      console.log(this.chef);
    });
    var selectedCategory = localStorage.getItem("selectedCategory");
    if (
      selectedCategory &&
      selectedCategory != null &&
      selectedCategory !== "null"
    ) {
      console.log(selectedCategory);
      this.selectedCategoryId = parseInt(selectedCategory);
    }
    var selectedDate = localStorage.getItem("selectedDate");
    if (selectedDate && selectedDate != null && selectedDate !== "null") {
      this.selectedCard = moment(selectedDate).format("YYYY/MM/DD");
      this.selectedDate = new Date(selectedDate);
    }
    var previousDate = localStorage.getItem("previousDate");
    if (previousDate && previousDate != null && previousDate !== "null") {
      this.previousDate = new Date(previousDate);
    }
  }
  async ionViewWillEnter() {

  }

  async ngOnInit() {
    const id = await this.authService.getId();

    console.log("check id: ", id);
    if (!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    console.log("id: ", this.id);
    await this.getItems();
  }
  public selectCategory(id: any) {
    this.selectedCategoryId = id;
    localStorage.setItem("selectedCategory", id);
    console.log(this.allItems);
    this.items = this.allItems.filter((item) => item.food_type.id == id);
    //this.getMenuItems();
    //this.sidenav.close();
  }

  async getItems() {
    try {
      this.isLoading = true;
      this.data = {} as any;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      await this.httpService.get("chef/" + this.id).subscribe((chef: any) => {
        this.data = chef.data;
      });
      await this.httpService.get("food_types").subscribe((category: any) => {
        this.categories = category.data.categories;
      });
      const params = {
        chef_id: await this.authService.getId(),
        role: 3,
      };
      this.httpService.post("products", params).subscribe((menu: any) => {
        console.log(menu);
        this.allItems = menu.data.results;
        this.items = menu.data.results;
        if(this.selectedCategoryId > 0 && this.selectedCategoryId != null && this.selectedCategoryId != ''){
          this.items = this.allItems.filter((item) => item.food_type.id == this.selectedCategoryId);
        }
      });
      console.log("items: ", this.allItems);
      console.log("chef: ", this.data);
      await this.cartService.getCartData();
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.global.errorToast();
    }
  }
  addItem(){
    this.global.navigateByUrl('/tabs/menu/add', false);
  }
  checkItemCategory(id) {
    const item = this.items.find((x) => x.food_type_id == id);
    if (item) return true;
    return false;
  }

  vegOnly(event) {
    console.log(event.detail.checked);
    this.items = [];
    this.nonVeg = false;
    if (event.detail.checked == true)
      this.items = this.allItems.filter((x) => x.veg == 1);
    else this.items = this.allItems;
    console.log("items: ", this.items);
  }

  nonVegOnly(event) {
    console.log(event.detail.checked);
    this.items = [];
    this.veg = false;
    if (event.detail.checked == true)
      this.items = this.allItems.filter((x) => x.veg == 0);
    else this.items = this.allItems;
    console.log("items: ", this.items);
  }
  closeSearchModal(event) {
    this.searchItems = [];
    this.query = "";
    this.itemSearch = false;
  }

  async onSearchChange(event) {
    console.log(event.detail.value);
    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  async querySearch() {
    this.searchItems = [];
    if (this.query.length > 0) {
      this.searchItems = await this.items.filter((item: any) =>
        item.name.toLowerCase().includes(this.query)
      );
    }
  }

  async destroy() {
    if (this.global.checkPlatform()) {
      const pop = await this.navCtrl.pop();
      console.log("destroy: ", pop);
      if (!pop) {
        this.ionViewWillLeave();
        this.ngOnDestroy();
      }
    }
  }

  async ionViewWillLeave() {
    console.log("ionViewWillLeave ItemsPage");
  }
  openSearchKeyboard() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
  }
  ngOnDestroy() {
    console.log("destroy itemspage");
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}
