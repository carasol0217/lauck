import Debug "mo:base/Debug";

actor {
  public func greet(name : Text) : async Text {
    Debug.print("greet method called");
    return "Hello, " # name # "! Welcome to the Internet Computer!" : Text;
  };
}