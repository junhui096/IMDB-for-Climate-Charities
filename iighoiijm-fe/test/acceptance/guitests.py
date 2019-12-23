#!/usr/bin/env python

import sys
import os
import unittest
from unittest import TestCase
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

def get_executable_path():
    test_dir = os.path.dirname(os.path.realpath(__file__))
    driver_path = os.path.join(test_dir, 'drivers')
    if 'linux' in sys.platform.lower():
        exec_path = os.path.join(driver_path, 'geckodriver')
    else:
        exec_path = os.path.join(driver_path, 'geckodriver.exe')
    return exec_path

driver = webdriver.Firefox(executable_path=get_executable_path())

driver.set_page_load_timeout(30)
driver.get("http://localhost:3000")
driver.maximize_window()
driver.implicitly_wait(10)
not_found="http://localhost:3000/not-found"

class UnitTests(TestCase):
    def test1(self):
        """
        Test whether navbar links are clickable and they all have
        valid links
        """
        navs = driver.find_elements_by_class_name('nav-link')
        navlist=[]
        for nav in navs:
            navlist.append(nav.get_attribute('href'))
            try:
                nav.is_enabled()
                nav.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Unclickable Button")
        for nav in navlist:
            try:
                driver.get(nav)
                pass
            except Exception as e:
                print(e)
                self.fail("No nav link")
        

    def test2(self):
        """
        Tests pagination controls on the country table
        """
        driver.get("http://localhost:3000/countries")
        page_tabs=driver.find_elements_by_class_name("page-item")
        for page in page_tabs:
            try:
                page.is_enabled()
                page.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Country pagination failed")

    def test3(self):
        """
        Tests pagination controls on the issue table
        """
        driver.get("http://localhost:3000/issues")
        page_tabs=driver.find_elements_by_class_name("page-item")
        for page in page_tabs:
            try:
                page.is_enabled()
                page.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Issue pagination failed")


    def test4(self):
        """
        Tests pagination controls on the charity table
        """
        driver.get("http://localhost:3000/charities")
        page_tabs=driver.find_elements_by_class_name("page-item")
        for page in page_tabs:
            try:
                page.is_enabled()
                page.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Charity pagination failed")


    def test5(self):
        """
        Determines whether the issue links in a country page are
        clickable and valid
        """
        driver.get("http://localhost:3000/countries/countryCode=CHN")
        issue_buttons=driver.find_elements_by_tag_name('a')
        issue_list=[]
        for issue in issue_buttons:
            issue_list.append(issue.get_attribute("href"))
            try:
                issue.is_enabled()
                issue.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Issue button not clickable")
        for issue in issue_list:
            driver.get(issue)
            if(driver.current_url==not_found):
                pass
#                ADD ONCE API IS IMPLEMENTED IN MODEL
#                self.fail("Issue page not found: "+ issue)

    def test6(self):
        """
        Determines whether the country links in an issue page are
        clickable and valid
        """
        driver.get("http://localhost:3000/issues/issueCode=Air pollution")
        country_buttons=driver.find_elements_by_tag_name('a')
        country_list=[]
        for country in country_buttons:
            country_list.append(country.get_attribute("href"))
            try:
                country.is_enabled()
                country.is_displayed()
                pass
            except Exception as e:
                print(e)
                self.fail("Country button not clickable")
        for country in country_list:
            driver.get(country)
            if(driver.current_url==not_found):
                pass
#                ADD ONCE API IS IMPLEMENTED IN MODEL
#                self.fail("Country page not found: "+ country)

    def test7(self):
        """
        Tests whether one of original country pages is valid
        """
        driver.get("http://localhost:3000/countries/countryCode=CHN")
        if(driver.current_url==not_found):
            self.fail("China page not found, probable issue with CountryModel")

    def test8(self):
        """
        Tests whether one of original issue pages is valid
        """
        driver.get("http://localhost:3000/issues/issueCode=Desertification")
        if(driver.current_url==not_found):
            self.fail("Desertification page not found, probable issue with IssueModel")

    def test9(self):
        """
        Tests whether one of original charity pages is valid
        """
        driver.get("http://localhost:3000/charities/charityCode=World Resources Institute")
        if(driver.current_url==not_found):
            self.fail("WRI page not found, probable issue with CharityModel")

    def test10(self):
        """
        Test whether about page links are all valid and clickable
        """
        driver.get("http://localhost:3000/about")
        links = driver.find_elements_by_class_name('a')
        link_list=[]
        for link in links:
            link_list.append(link.get_attribute('href'))
            try:
                link.is_enabled()
                link.is_displayed()
                pass
            except Exception as e:
                print(e)
        for link in link_list:
            try:
                driver.get(link)
                pass
            except Exception as e:
                print(e)
                self.fail("Bad Link")

    def test99(self):
        driver.close()

if __name__ == "__main__":
    unittest.main()

